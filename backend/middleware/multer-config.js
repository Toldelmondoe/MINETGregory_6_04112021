const multer = require('multer'); // multer est un package qui permet de faciliter la gestion des fichiers envoyés avec des requêtes HTTP vers l'API

const MIME_TYPES = { // définition du dictionnaire d'extensions
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // objet de configuration 
  destination: (req, file, callback) => { // destination des images
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // nouveau nom du fichier image pour éviter les doublons
    const name = file.originalname.split(' ').join('_'); // nom généré par le remplacement des espaces par des underscore gràce à split
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // création du filename de l'image à l'aide d'un timestamp Date.now pour garantir un nom unique
  }
});

module.exports = multer({ storage }).single('image'); // exportation du fichier image unique gràce à multer