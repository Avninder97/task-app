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

/*
    ALL the below mentioned routes are protected and requires user to be logged In

    GET ROUTE - get all the tasks of the loggedIn user
    POST ROUTE - create a new task for loggedIn user
*/
router
    .route('/tasks')
    .get(tokenValidator, getTasks)
    .post(tokenValidator, createTask);

/*
    ALL the below mentioned routes are protected 
    and the passed task id must point to a task that belongs 
    to loggedIn user for routes to be successful in performing expected operations

    GET ROUTE - get a task from id passed in the params
    PATCH ROUTE - update the contents of the task with id that has been passed in the params
    DELETE ROUTE - delete the task whose id has been passed in the params
*/
router
    .route('/tasks/:id')
    .get(tokenValidator, getSingleTask)
    .patch(tokenValidator, updateTask)
    .delete(tokenValidator, deleteTask);

module.exports = router;