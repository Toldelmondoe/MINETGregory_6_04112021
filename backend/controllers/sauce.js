// Logique métier //
const Sauce = require('../models/Sauce'); // importation du modèle Sauce
const fs = require('fs'); // file system, package qui permet de modifier et/ou supprimer des fichiers

exports.createSauce = (req, res, next) => { // fonction pour permettre la création de sauce
    const sauceObject = JSON.parse(req.body.sauce); // Récupération de toutes les informations à l'intérieur des champs de saisie de sauce
    delete sauceObject._id; // Suppression des _id, mongoDB en affectera un nouveau par défault
    const sauce = new Sauce({ // Toutes les valeurs d'entrée sont placées dans un élément
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Ajout de l'imageUrl à l'image
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => { // fonction pour activer la modification d'une sauce spécifique
    const sauceObject = req.file ? // vérification si la modification concerne le body ou un nouveau fichier image
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
      .catch(error => res.status(403).json({ error: error | 'Unauthorized request !' }));
};

exports.deleteSauce = (req, res, next) => { // fonction pour activer la supression d'une sauce spécifique
    Sauce.findOne({ _id: req.params.id }) // identification de la sauce
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // récupération de l'adresse de l'image
            fs.unlink(`images/${filename}`, () => { // suppression de l'image du serveur
                Sauce.deleteOne({ _id: req.params.id }) // supression de la sauce de la bdd
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // fonction de chargement des informations lors de la sélection d'une sauce spécifique
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => { // fonction qui récupère toutes les sauces existantes de la base de données et les affiche sur la page principale
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => { // fonction qui permet aux utilisateurs de likes/dislikes un-likes/un-dislikes
    const like = req.body.like;
    if(like === 1) { // option likes
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
        
        .catch( error => res.status(400).json({ error }))
    } else if(like === -1) { // option dislikes
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce !' }))
        .catch( error => res.status(400).json({ error }))

    } else { // option un-likes / un-dislikes
        Sauce.findOne( { _id: req.params.id })
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 },$pull: { usersLiked: req.body.userId }, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous n\'aimez `plus cette sauce !' }))
                .catch( error => res.status(400).json({ error }))
                }
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( { _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Désormais vous aimez cette sauce !' }))
                .catch( error => res.status(400).json({ error }))
                }           
        })
        .catch( error => res.status(400).json({ error }))             
    }   
};