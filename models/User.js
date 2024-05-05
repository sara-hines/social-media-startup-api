const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (v) {
                    // Explanation of the regex pattern to determine if an email address is valid: the email should begin with 1 or more 'word' characters, which may have . or - characters interspersed in them, followed by the @ symbol, followed by 1 or more 'word' characters which which may have . or - characters interspersed in them (this is the domain name part of the email), followed by the top-level domain (which starts with a . and has 2 or 3 'word' characters).
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email",
            },
            required: [true, "Email required"],
        }, 
        // thoughts will be an array of thought _id's which can be populated to display the actual thoughts
        thoughts: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'thought',
            },
        ],
        // friends will be an array of user _id's which can be populated to display the actual users (friends)
        friends: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'user',
            },
        ],
    }, 
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    },
);

userSchema
    // Create a virtual property called friendCount which will display the number of friends by sharing the length of the friends array.
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });

const User = model('user', userSchema);

module.exports = User;