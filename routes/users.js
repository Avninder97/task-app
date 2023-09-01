const express = require('express');
const router = express.Router();
const { 
    getUser, 
    createUser, 
    userLogin, 
    userLogout, 
    userLogoutAll, 
    updateUser, 
    deleteUser 
} = require('../controllers/users');

const { 
    tokenValidator 
} = require('../middlewares/auth');

/*
    GET ROUTE - Gets the info of the loggedIn user
    PATCH ROUTE - Updates the info of loggedIn User
    DELETE ROUTE - Deletes the loggedIn User
*/
router
    .route('/users/me')
    .get(tokenValidator, getUser)
    .patch(tokenValidator, updateUser)
    .delete(tokenValidator, deleteUser);

/*
    POST ROUTE - Used to create a new user in DB
*/
router
    .route('/users')
    .post(createUser)

/*
    POST ROUTE - Used to login an existing user
*/
router
    .route('/users/login')
    .post(userLogin);

/*
    POST ROUTE - Used to logout a user from current device
*/
router
    .route('/users/logout')
    .post(tokenValidator, userLogout);

/*
    POST ROUTE - Used to logout user from all the devices
*/
router
    .route('/users/logoutAll')
    .post(tokenValidator, userLogoutAll);

module.exports = router;