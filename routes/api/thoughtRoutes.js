const router = require('express').Router();
const {
    getThoughts, 
    getSingleThought, 
    createThought, 
    updateThought, 
    deleteThought,
    addReaction, 
    removeReaction

} = require('../../controllers/thoughtController');

// api/thoughts
// Routes to: GET all thoughts for all users; POST a new thought for a user
router.route('/').get(getThoughts).post(createThought);

// api/thoughts/:thoughtId
// Routes to: GET a single thought; PUT/update a thought; DELETE a thought 
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
// Routes to: POST a new reaction; DELETE a reaction
router.route('/:thoughtId/reactions').post(addReaction).delete(removeReaction);

module.exports = router;