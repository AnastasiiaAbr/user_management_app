const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const pool = require('../db/db');
const getUIdValue = require('../utils/getUIdValue');
const client = require('../utils/mailService');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashPass = await bcrypt.hash(password, 10);
    const id = getUIdValue();

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await pool.query(
      `
      INSERT INTO users
      (id, name, email, password_hash, status, verification_token)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      `,
      [id, name, email, hashPass, 'unverified', verificationToken]
    );

    const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify/${verificationToken}`;

    await client.send({
      from: {
        email: "hello@demomailtrap.co",
        name: "User Management System"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Verify your account",
      html: `
    <h2>User Management System</h2>

    <p>Thank you for registering.</p>

    <a href="${verifyLink}">
      Verify Account
    </a>
  `
    });

    res.status(201).json({
      message: 'User registered successfully'

    });
  } catch (error) {

    if (error.code === '23505') {
      return res.status(400).json({
        message: 'Email already existst'
      })
    }
    res.status(500).json({
      message: error.message
    });

  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `
    SELECT * 
    FROM users 
    WHERE email = $1
    `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    if (user.status === 'blocked') {
      return res.status(403).json({
        message: 'Your account is blocked'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    await pool.query(
      `
    UPDATE users
    SET last_login = NOW()
    WHERE id = $1
    `,
      [user.id]
    );

    const token = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

router.get(
  '/verify/:token',
  async (req, res) => {
    try {
      const { token } = req.params;
      const result = await pool.query(
        `
        UPDATE users 
        SET 
        status = CASE 
        WHEN status = 'unverified'
        THEN 'active'
        ELSE status 
        END,
        verified_at = NOW(),
        verification_token = NULL
        WHERE verification_token = $1
        RETURNING *
        `,
        [token]
      );

      if (result.rowCount === 0) {
        return res.status(400).send(
          'Invalid verification link'
        );
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/login?verified=true`
      );
    } catch (error) {
      res.status(500).send(
        'Server error'
      )
    }
  }
);

module.exports = router;