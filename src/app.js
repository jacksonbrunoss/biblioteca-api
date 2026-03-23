const express = require('express');
const app = express();

app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/users', require('./routes/users'));
app.use('/loans', require('./routes/loans'));

app.get('/', (req, res) => res.json({ message: 'API Biblioteca Escolar 📚' }));

module.exports = app;