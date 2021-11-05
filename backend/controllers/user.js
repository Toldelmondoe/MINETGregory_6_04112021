const bcrypt = require('bcrypt'); // bcrypt est une fonction adaptative de hachage
const jwt = require('jsonwebtoken'); // package pour créer et vérifier les tokens d'authentification

const User = require('../models/User'); // modèle user

const emailValidator = require('email-validator'); // email validator package
const passwordValidator = require('password-validator'); // password validator package
const MaskData = require('maskdata'); // package pour masquer des données 

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) // 8 caractères minimum 
.is().max(50) // 50 caractères maximum 
.has().uppercase() // nécessite des majuscules
.has().lowercase() // nécessite des minuscules
.has().digits() // nécessite un chiffre
.has().not().symbols(); // ne contient pas de symboles

// ces 2 fonctions signup et login sont exportés vers ../routes/user.js

exports.signup = (req, res, next) => { // fonction qui permet aux utilisateurs d'enregistrer un compte
    if (!emailValidator.validate(req.body.email) || !passwordSchema.validate(req.body.password)) { // si l'email et le mot de passe ne sont pas valides alors une erreur est retournée
        return res.status(400).json({ message: 'Vérifiez le format de votre adresse e-mail et votre mot de passe doit comporter au moins 8 caractères, contenir des majuscules, des lettres minuscules et des chiffres.'});
      
    }   else if (emailValidator.validate(req.body.email) || passwordSchema.validate(req.body.password)) { // si l'email et le mot de passe sont valide alors :
            const maskedMail = MaskData.maskEmail2(req.body.email); // masquage de l'adresse mail
            bcrypt.hash(req.body.password, 10) // le mot de passe de l'utilisateur est haché gràce à bcrypt et le salt qui est définit à 10.
            .then(hash => { // création d'un objet contenant les informations utilisateur
                const user = new User ({ // création d'un nouvel utilisateur
                    email: maskedMail, 
                    password: hash
                });
                user.save() // sauvegarde de ces informations sur la base de données
                .then( hash => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
        };   
}
    
    
exports.login = (req, res, next) => { // fonction qui permet aux utilisateurs de se connecter à l'application
    const maskedMail = MaskData.maskEmail2(req.body.email);
        User.findOne({ email: maskedMail }) // fonction qui vérifie la saisie de l'e-mail et la compare à la collection de la database pour se connecter à l'application
            .then(user => {
                if (!user) { // Si l'email n'est pas trouvé dans la base de données, alors une erreur est retournée
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                bcrypt.compare(req.body.password, user.password) // Si l'email est existant sur la base de données, alors la fonction est utilisée pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
                .then(valid => {
                    if (!valid) { // Si le mot de passe est différent ou non trouvé alors une erreur est retournée
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ // si l'email et enfin le mot de passe correspondent, alors l'utilisateur est connecté
                    userId: user._id,
                    token: jwt.sign( // la fonction sign de jsonwebtoken est utilisée pour encoder un nouveau token
                        { userId: user._id}, // ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
                        'RANDOM_TOKEN_SECRET', // une chaîne secrète de développement temporaire RANDOM_TOKEN_SECRET est utilisée pour encoder notre token
                        { expiresIn: '24h'}) // la durée de validité du token est définit à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures
                    })
                })
            .catch(error => res.status(500).json({ error }));
            })
        .catch(error => res.status(500).json({ error }));
};