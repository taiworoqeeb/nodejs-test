const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema({
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    },
    name: {
        type: String
    },
    reply:{
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Replies', ReplySchema);
