const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Les adresses électroniques dans la base de données sont uniques et mongoose-unique-validator est utilisé pour garantir leur unicité et signaler les erreurs
const userSchema = mongoose.Schema({ // un shema mongoose est généré pour un utilisateur
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);