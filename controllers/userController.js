const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // GET all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // GET a single user by its _id and populated thought and friend data
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }, 

    // POST a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // PUT to update a user by its _id
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId }, 
                { username: req.body.username, email: req.body.email }, 
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Unable to update user; please ensure you have provided a valid userId, username, and email.' })
            }

            res.json('User has been updated 🎉');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }, 

    // DELETE to remove user by its _id
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'User could not be deleted; no user found with this ID.' });
            }

            res.json({ message: 'User successfully deleted!' });
        } catch (err) {
        res.status(500).json(err);
        }
    }, 

    // POST to add a new friend to a user's friend list
    async addFriend(req, res) {
        console.log('Request to add a friend received.\n Request body: ' + req.body);
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId }, 
                { $addToSet: { friends: req.params.friendId } }, 
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Friend could not be added; no user found with that ID.' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // DELETE to remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                .status(404)
                .json({ message: 'Friend could not be removed; no user found with that ID.'});
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};