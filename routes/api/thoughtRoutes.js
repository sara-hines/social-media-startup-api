const router = require('express').Router();
// Require the functions needed by the routes.
const {
    getThoughts, 
    getSingleThought, 
    createThought, 
    updateThought, 
    deleteThought,
    addReaction, 
    removeReaction,
} = require('../../controllers/thoughtController');

// For requests coming to api/thoughts, Routes to: GET all thoughts for all users; POST a new thought for a user.
router.route('/').get(getThoughts).post(createThought);

// For requests coming to api/thoughts/:thoughtId, routes to: GET a single thought; PUT/update a thought; DELETE a thought.
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// For requests coming to /api/thoughts/:thoughtId/reactions, routes to: POST a new reaction; DELETE a reaction.
router.route('/:thoughtId/reactions').post(addReaction).delete(removeReaction);

module.exports = router;