const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
    // GET to get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // GET to get a single thought by its _id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID.' })
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // POST to create a new thought. The created thought's _id must be pushed to the associated user's thoughts array field.
    async createThought(req, res) {
        console.log('Request to create a new thought received.\nRequest body: ' + req.body);

        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId }, 
                { $addToSet: { thoughts: thought._id } }, 
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but no user was found with that ID.',
                })
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // PUT to update a thought by its _id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body }, 
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'Thought could not be updated; no thought found with this ID.' }); 
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'Thought could not be deleted; no thought found with this ID.' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId }, 
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought deleted, but no user was found with this thought.',
                });
            }

            res.json({ message: 'Thought successfully deleted.' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // POST to add a new reaction
    async addReaction(req, res) {
        console.log('Request to add a reaction received.\n Request body: ' + req.body);
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId }, 
                { $addToSet: { reactions: req.body } }, 
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'Reaction could not be added; no thought found with that ID.' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // DELETE to remove a reaction
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                // The reactionId is the only thing we need to pass in the body
                { $pull: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res
                .status(404)
                .json({ message: 'Reaction could not be removed; no thought found with that ID.'});
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
}