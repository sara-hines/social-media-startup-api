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

// /api/users
// Routes to: GET all users; POST a new user
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
// Routes to: GET a single user; UPDATE a user; DELETE a user
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
// Routes to: POST a new friend for a user; DELETE a friend from a user
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;