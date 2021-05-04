const mongoose = require('mongoose');

const postsSchema = mongoose.Schema({
    memoryText: {
        type: String,
        required: true
    },
    hashTags: [{
        type: String,
    }],
    dateOfTheEvent: {
        type: String,
        required: true
    },
    timeOfTheEvent: {
        type: String,
        required: true
    },
    tagConnections: [{
        type: String,
    }],
    addMedia: [{
        type: String
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

postsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postsSchema.set('toJSON', {
    virtuals: true,
});

exports.Posts = mongoose.model('Posts', postsSchema);