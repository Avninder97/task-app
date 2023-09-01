const express = require('express');
const router = express.Router();

const { 
    getTasks, 
    createTask, 
    getSingleTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/tasks');

const { 
    tokenValidator 
} = require('../middlewares/auth');

router.get('/tasks', tokenValidator, getTasks);

router.post('/tasks', tokenValidator, createTask);

router.get('/tasks/:id', tokenValidator, getSingleTask);

router.patch('/tasks/:id', tokenValidator, updateTask);

router.delete('/tasks/:id', tokenValidator, deleteTask);

module.exports = router;