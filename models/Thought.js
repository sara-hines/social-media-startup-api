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
            // Use the built-in Javascript functions toLocaleDateString() and toLocaleTimeString() to format timestamps.
            get: function (date) {
                return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            },
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtSchema
    // Create a virtual property called reactionCount which will display the number of reactions a thought has by sharing the length of the reactions array.
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;