const express = require('express');
const bodyParser = require('body-parser'); // bodyParser est utilisé pour extraire les informations des requêtes HTTP et les rendre utilisables
const mongoose = require('mongoose'); // mongosse est utilisé pour se connecté à la base de données
const path = require('path'); // path est utilisé pour télécharger nos images
const helmet = require('helmet'); // Helmet aide à sécuriser les applications Express en définissant divers en-têtes HTTP.
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://'+process.env.LOGIN+':'+process.env.PASSWORD+"@"+process.env.URL',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))
;

const app = express();

app.use(helmet()); //

app.use((req, res, next) => { // CORS - partage de ressources entre serveurs
    res.setHeader('Access-Control-Allow-Origin', '*'); // header permettant d'accéder à l'API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // header permettant d'ajouter les headers mentionnés aux requêtes envoyées vers mon API (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // header permettant d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes); // routes utilisées pour les sauces
app.use('/api/auth', userRoutes); // routes utilisées pour les utilisateurs

module.exports = app;