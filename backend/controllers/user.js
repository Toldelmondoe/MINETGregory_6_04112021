const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Le mot de passe de l'utilisateur est haché gràce à bcrypt
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password) // la fonction compare debcrypt est utilisée pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // j'utilise la fonction sign dejsonwebtoken pour encoder un nouveau token
                            { userId: user._id }, // ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
                            'RANDOM_TOKEN_SECRET', // j'utilise une chaîne secrète de développement temporaire RANDOM_TOKEN_SECRET pour encoder notre token
                            { expiresIn: '24h' } // je définis la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};