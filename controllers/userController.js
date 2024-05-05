const { User, Thought } = require('../models');

module.exports = {
    // Logic for the GET route to get all users.
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-__v');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the GET route to get a single user by its _id. Populate the thought and friend data so that the actual thoughts and friends can be viewed, rather than their _id's.
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate([
                    { path: 'thoughts', select: '-__v' },
                    { path: 'friends', select: '-__v' },
                ]);

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the POST route to create a new user. The username and email should be provided in the request body.
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the PUT route to update a user by _id. Any thoughts that the user created will be associated with their new username.
    async updateUser(req, res) {
        try {
            const oldUser = await User.findOne({ _id: req.params.userId });
            const oldUsername = oldUser.username;

            const user = await User.findOneAndUpdate(
                // Filter by the userId from the request parameter.
                { _id: req.params.userId },
                // Update the user's username and email to the values provided in the request body.
                { username: req.body.username, email: req.body.email },
                // runValidators: true is specified so that the same validation rules which applied when creating a user also apply when updating a user.
                { runValidators: true, new: true },
            );

            if (!user) {
                return res.status(404).json({ message: 'Unable to update user; please ensure you have provided a valid userId as the request parameter and a valid username and email in the request body.' });
            }

            const thoughtsUpdateResult = await Thought.updateMany(
                // Find the user's thoughts by searching for thoughts which have the user's oldUsername in their username field.
                { username: oldUsername },
                // Update any identified thoughts to have the username from the request body in their username field.
                { username: req.body.username },
                // runValidators so that validation rules apply.
                { runValidators: true },
            );

            // If there were no thoughts found and modified, send an informative message.
            if (thoughtsUpdateResult.modifiedCount === 0) {
                return res.json({ message: 'User successfully updated. No thoughts associated with the user were found, so no thoughts were updated.' });
            }

            // Otherwise, respond that the user and their thoughts were updated.
            res.json('User successfully updated. The users thoughts were updated to reflect the new username as well.');
        } catch (err) {
            // Send server error if necessary.
            res.status(500).json(err);
        }
    },

    // Logic for the DELETE route to remove user by _id. The only item needed to delete a user is the user's _id provided as the request parameter.
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({
                _id: req.params.userId,
            });

            if (!user) {
                return res.status(404).json({ message: 'User could not be deleted; no user found with this ID.' });
            }

            // Delete any thoughts the user created, and respond with the approprate message based on whether there were any thoughts found and deleted.

            const thoughtsDeleteResult = await Thought.deleteMany({
                username: user.username,
            });

            if (thoughtsDeleteResult.deletedCount === 0) {
                return res.json({ message: 'User successfully deleted. No thoughts associated with the user were found, so no thoughts were deleted.' });
            }

            res.json({ message: 'User successfully deleted. The user\'s thoughts were deleted as well.' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the POST route to add a new friend to a user's friend list. The user _id of the user (userId) and the user _id of the friend to be added (friendId) are both provided as request parameters.
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                // Use the userId as the filter to find the correct user to update.
                { _id: req.params.userId },
                // Add the friendId to the user's friends array.
                { $addToSet: { friends: req.params.friendId } },
                // runValidators and return the updated user.
                { runValidators: true, new: true },
            );

            // Send the appropriate response based on whether the update was successful.

            if (!user) {
                return res.status(404).json({ message: 'Friend could not be added; no user found with that ID.' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the DELETE route to remove a friend from a user's friend list. The user _id of the user (userId) and the user _id of the friend to be removed (friendId) are both provided as request parameters.
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                // Use the userId as the filter to find the correct user to update.
                { _id: req.params.userId },
                // Remove the friendId from the user's friends array.
                { $pull: { friends: req.params.friendId } },
                // Return the updated user.
                { new: true },
            );

            // Send the appropriate response based on whether the update was successful.

            if (!user) {
                return res.status(404).json({ message: 'Friend could not be removed; no user found with that ID.' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};