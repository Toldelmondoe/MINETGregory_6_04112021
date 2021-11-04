const jwt = require('jsonwebtoken');
// middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token de la requête entrante dans le headers
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // vérification du token
        const userId = decodedToken.userId; // récupération de l'id du token
        if (req.body.userId && req.body.userId !== userId) { // le userId de la requête et celui du token sont comparés
            throw 'User ID non valable !'; // si les userId sont différents alors User ID non valable
        } else { // si les userId sont identiques alors on peut passer à la suite
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};