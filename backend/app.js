const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauce');

mongoose.connect('mongodb+srv://Toldelmondoe:23ca07ro02@cluster0.87c5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))
;

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // header permettant d'accéder à mon API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // header permettant d'ajouter les headers mentionnés aux requêtes envoyées vers mon API (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // header permettant d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    next();
});

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);

module.exports = app;