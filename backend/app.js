const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const DB_USER = process.env.DB_USERNAME
const DB_PASS = process.env.DB_PWD
const DB_CLUST = process.env.DB_CLUSTER
const DB_CLUSTNAME = process.env.DB_CLUSTERNAME
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');


const app = express();

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUST}.pujhp.mongodb.net/${DB_CLUSTNAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;