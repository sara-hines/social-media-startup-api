const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');


const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date, 
            default: Date.now,
            get: function (date) {
                return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            },
        },
        // CHECK IF THIS IS OK OR IF THIS SHOULD BE AN ACTUAL REF
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    }, 
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;