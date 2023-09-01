const pool = require('../utils/db');

const { 
    createIfNotExistUsersTable, 
    createIfNotExistTokensTable, 
    createIfNotExistTasksTable 
} = require('../utils/dbHelper');

module.exports = {
    getTasks: async (req, res) => {
        try {
            await createIfNotExistTasksTable();
            const ownerId = req.decoded.id;
            const foundTasks = (await pool.query(
                `SELECT * from tasks WHERE ownerId = '${ownerId}';`
            ))[0];
            console.log(foundTasks);
            return res.status(200).json({
                message: "Tasks sent",
                data: foundTasks
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    },

    getSingleTask: async (req, res) => {
        try {
            const id = req.params.id, ownerId = req.decoded.id;
            const foundTask = await pool.query(
                `SELECT * FROM tasks WHERE id = ${id} AND ownerId = ${ownerId};`
            );
            console.log(foundTask);
            return res.status(200).json({
                message: "Task sent",
                data: foundTask
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    },

    createTask: async (req, res) => {
        try {
            await createIfNotExistTasksTable();
            const { description, completed } = req.body;
            const id = req.decoded.id;
            
            const createdTaskId = (await pool.query(
                `INSERT INTO tasks (\`description\`, \`completed\`, \`ownerId\`)
                VALUES ('${description}', ${completed || true}, ${id})`
            ))[0].insertId;
            console.log(createdTaskId)
    
            return res.status(201).json({
                message: "Task Created",
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    },

    updateTask: async (req, res) => {
        try {
            const id = req.params.id, userId = req.decoded.id;
    
            console.log(id, userId);
    
            const allowedUpdates = ['description', 'completed'];
            const updates = Object.keys(req.body);
            const isValidReq = updates.every((update) => {
                return allowedUpdates.includes(update);
            })
    
            if(!isValidReq){
                throw new Error('Invalid Update Call');
            }
    
            const foundTask = (await pool.query(
                `SELECT * FROM tasks WHERE id = ${id} AND ownerId = '${userId}';`
            ))[0][0];
    
            if(!foundTask){
                throw new Error('Task not found');
            }
    
            updates.forEach((update) => {
                foundTask[update] = req.body[update];
            });
    
            const updatedTask = await pool.query(
                `UPDATE tasks SET description = '${foundTask.description}', completed = ${foundTask.completed} WHERE id = ${foundTask.id};`
            );
            console.log(updatedTask[0]?.affectedRows);
    
            if(updatedTask[0]?.affectedRows < 1){
                return res.status(404).json({
                    message: "Task Not Found"
                });
            }
    
            return res.status(200).json({
                message: "Task Updated",
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const taskId = req.params.id, userId = req.decoded.id;
            const deletedResult = await pool.query(`DELETE FROM tasks WHERE id = ${taskId} AND ownerId = ${userId}`);
    
            if(!deletedResult || deletedResult[0]?.affectedRows < 1){
                return res.status(404).json({
                    message: "Task Not Found"
                });
            }
    
            return res.status(200).json({
                message: "Task Deleted",
                data: deletedResult[0]?.affectedRows || 0
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    }
};