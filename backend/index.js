const authRoutes = require('./routes/authRoutes');
const pool = require('./db/db');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()')
  .then(result => {
    console.log('DB connected');
    console.log(result.rows[0]);
  })
  .catch(err => {
    console.log(err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Server is running')
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})