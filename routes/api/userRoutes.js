const router = require('express').Router();
const {
    getUsers, 
    getSingleUser, 
    createUser,
    updateUser, 
    deleteUser, 
    addFriend, 
    removeFriend,
} = require('../../controllers/userController');

// For requests coming to /api/users, routes to: GET all users; POST a new user.
router.route('/').get(getUsers).post(createUser);

// For requests coming to /api/users/:userId, routes to: GET a single user; UPDATE a user; DELETE a user.
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// For requests coming to /api/users/:userId/friends/:friendId, routes to: POST a new friend for a user; DELETE a friend from a user.
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;