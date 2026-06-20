const express = require('express');
const pool = require('../db/db');

const authMiddleware = require('../middlware/authMiddleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
        id, 
        name,
        email,
        status,
        last_login
        FROM users
        ORDER BY last_login DESC
        `
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
);

router.put(
  '/block',
  authMiddleware,
  async (req, res) => {
    try {
      const { ids } = req.body;

      await pool.query(
        `
        UPDATE users
        SET
        previous_status = status,
        status = 'blocked'
        WHERE id = ANY($1)
        `,
        [ids]
      );

      res.json({
        message: 'Users blocked'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
)

router.put(
  '/unblock',
  authMiddleware,
  async (req, res) => {
    try {
      const { ids} = req.body;

      await pool.query(
        `
        UPDATE users
        SET 
        status = previous_status,
        previous_status = NULL
        WHERE id = ANY($1)
        `,
        [ids]
      )
   res.json({
        message: 'Users unblocked'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
);

router.delete(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const { ids } = req.body;
      await pool.query (
        `
        DELETE FROM users 
        WHERE id = ANY($1)
        `,
        [ids]
      );

      res.json({
        message: 'Users deleted'
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: 'Server error'
      });
    }
  }
)

router.delete(
  '/unverified',
  authMiddleware,
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM users
        WHERE status = 'unverified'
        `
      );
      res.json({
        message: 'Unverified users deleted'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
);

module.exports = router;