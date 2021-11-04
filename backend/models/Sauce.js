const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({  // On génère un shema mongoose pour notre sauce
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true }, 
    heat: { type: Number, required: true },
    likes: { type: Number, required: false, default : 0 },
    dislikes: { type: Number, required: false, default : 0 },
    usersLiked: [{ type: String, required: false, default : [] }],
    usersDisliked: [{ type: String, required: false, default : [] }],
});

module.exports = mongoose.model('Sauce', sauceSchema);