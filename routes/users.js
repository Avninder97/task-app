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

const { tokenValidator } = require('../middlewares/auth');



router.get('/users/me', tokenValidator, getUser);

router.post('/users', createUser);

router.post('/users/login', userLogin);

router.post('/users/logout', tokenValidator, userLogout);

router.post('/users/logoutAll', tokenValidator, userLogoutAll);

router.patch('/users/me', tokenValidator, updateUser);

router.delete('/users/me', tokenValidator, deleteUser);

module.exports = router;