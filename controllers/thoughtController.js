const { Thought, User } = require('../models');

module.exports = {
    // Logic for the GET route to get all thoughts.
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().select('-__v');
            // Respond with the data obtained from the find() query.
            res.json(thoughts);
        } catch (err) {
            // If a server error occurred, send a 500 http status.
            res.status(500).json(err);
        }
    },

    // Logic for the GET route to get a single thought by its _id, which must be provided as a request parameter.
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({
                _id: req.params.thoughtId,
            })
            .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID.' });
            }

            // As long as the thought was found, the data will be sent in response.
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Logic for the POST route to create a new thought (and associate the thought with the user who posted it). To create a new thought, the userId, username, and thoughtText should ideally be provided in the request body.
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                // The userId from the request body is used as a filter to find the correct user.
                { _id: req.body.userId },
                // The created thought's _id is added to the associated user's thoughts array field. This ensures the thought is associated with the correct user.
                { $addToSet: { thoughts: thought._id } },
                // If the user variable needs to be accessed, the new, updated user would be returned.
                { runValidators: true, new: true },
            );

            // In keeping with mongoose's flexibility, a thought can be created without finding the user, but a JSON message is sent to inform that the user was not found.
            if (!user) {
                return res.status(404).json({ message: 'Thought created, but no user was found with that ID.' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the PUT to update a thought by its _id, which must be provided as a request parameter. The request body can contain the thoughtText only, the username only, or the thoughtText and username, depending on what needs to be updated.
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                // Identify the correct thought to update by using the provided thoughtId as the _id.
                { _id: req.params.thoughtId },
                // Use the request body to update the thought.
                { $set: req.body },
                { runValidators: true, new: true },
            );

            // Respond with an informative JSON message, data, or error as appropriate, depending on whether the thought was able to be found and updated.

            if (!thought) {
                return res.status(404).json({ message: 'Thought could not be updated; no thought found with this ID.' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the DELETE route to delete a thought by _id, which must be provided as a request parameter.
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({
                _id: req.params.thoughtId,
            });

            if (!thought) {
                return res.status(404).json({ message: 'Thought could not be deleted; no thought found with this ID.' });
            }

            // A deleted thought should no longer appear under the user who created the thought, so the user is updated.
            const user = await User.findOneAndUpdate(
                // Find the user who has the thoughtId from the request parameter as a value in their thoughts field.
                { thoughts: req.params.thoughtId },
                // Remove the thoughtId from the user's thoughts array.
                { $pull: { thoughts: req.params.thoughtId } },
                // If the user variable needs to be accessed, the updated user will be returned.
                { new: true },
            );

            // A thought can still be deleted even if the user who posted the thought was not found.
            if (!user) {
                return res.status(404).json({ message: 'Thought deleted, but no user was found with this thought.' });
            }

            // The below message will be sent if the thought was deleted and the associated user was updated.
            res.json({ message: 'Thought successfully deleted.' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the POST route to add a new reaction. The thought _id is provided as a request parameter, and the reactionBody and username (for the reaction to the thought) should be provided in the request body.
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                // Filter by the thought _id which was provided as the request parameter.
                { _id: req.params.thoughtId },
                // Add the content of the request body to the thought's reactions field.
                { $addToSet: { reactions: req.body } },
                // Enforce validation rules. Return the updated thought.
                { runValidators: true, new: true },
            );

            // A reaction to a thought can not be added if the thought is not found.
            if (!thought) {
                return res.status(404).json({ message: 'Reaction could not be added; no thought found with that ID.' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Logic for the DELETE route to remove a reaction. The thought _id is provided as a request parameter, and the reactionId is the only item which needs to be provided in the request body.
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                // Filter by the thought _id which was provided as the request parameter.
                { _id: req.params.thoughtId },
                // Remove the reactionId from the thought's reactions field.
                { $pull: { reactions: req.body } },
                // Return the updated thought.
                { new: true },
            );

            // Reactions are very dependent on the Thought model; a reaction can not be removed if the thought is not found.
            if (!thought) {
                return res.status(404).json({ message: 'Reaction could not be removed; no thought found with that ID.' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};