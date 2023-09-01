const pool = require('../utils/db');

const { 
    createIfNotExistUsersTable, 
    createIfNotExistTokensTable 
} = require('../utils/dbHelper');

const { 
    encryptor, 
    createToken, 
    verifier 
} = require('../utils/auth');

module.exports = {
    getUser: async (req, res) => {
        try {
            await createIfNotExistTokensTable();
            const id = req.decoded.id;
            const foundUser = (await pool.query(`SELECT * FROM users WHERE id = ${id}`))[0][0];
            return res.status(200).json({
                message: "User sent",
                data: foundUser
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    },

    createUser: async (req, res) => {
        try {
            await createIfNotExistTokensTable();
            const { username, email, age = 0, password } = req.body;
            if(!username || !email || !password){
                throw new Error('Incomplete Data')
            }
    
            const hashedPassword = await encryptor(password);
            const createdUserId = (await pool.query(
                `INSERT INTO users (\`username\`, \`email\`, \`password\`, \`age\`)
                VALUES ('${username}', '${email}', '${hashedPassword}', ${(age < 0 ? 0 : age)})`
            ))[0].insertId;
    
            const token = await createToken(createdUserId);
    
            // Insert token into tokens table
            const tokenId = (await pool.query(
                `INSERT INTO tokens (\`userId\`, \`token\`)
                VALUES ('${createdUserId}', '${token}');`
            ))[0].insertId;
    
            if(tokenId){
                return res.status(201).json({
                    message: "User Created",
                    data: {
                        createdUserId, token
                    }
                });
            }
            return res.status(400).json({
                message: "Unable to login"
            });
    
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: "Unable to Signup"
            });
        }
    },

    userLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            if(!username || !password){
                throw new Error('Incomplete Data');
            }
            await createIfNotExistUsersTable();
            await createIfNotExistTokensTable();
            const foundUser = (await pool.query(
                `SELECT * FROM users WHERE username = '${username}'`
            ))[0][0];
            
            if(await verifier(password, foundUser.password)){
                const token = await createToken(foundUser.id);
                
                const tokenId = (await pool.query(
                    `INSERT INTO tokens (\`userId\`, \`token\`)
                    VALUES ('${foundUser.id}', '${token}');`
                ))[0].insertId;
    
                if(tokenId){
                    return res.status(200).json({
                        message: "User Logged In",
                        data: {
                            foundUser, token
                        }
                    })
                }
            }else{
                return res.status(400).json({
                    message: "Unable to login"
                });
            }
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: "Unable to login"
            });
        }
    },

    userLogout: async (req, res) => {
        try {
            const token = req.token;
            const deleteResult = await pool.query(
                `DELETE FROM tokens WHERE token = '${token}'`
            )
            // console.log("affected rows", deleteResult[0].affectedRows);
            if(deleteResult[0].affectedRows < 1){
                throw new Error('Logout Error');
            }
            return res.status(200).json({
                message: "logged out"
            })
        }catch(err){
            console.log(err);
            return res.status(400).json({
                message: "Unable to logout"
            });
        }
    },

    userLogoutAll: async (req, res) => {
        try{
            const id = req.decoded.id;
            const deleteResult = await pool.query(
                `DELETE FROM tokens WHERE userId = '${id}'`
            )
            
            if(deleteResult[0].affectedRows < 1){
                throw new Error('Logout Error');
            }
            return res.status(200).json({
                message: "logged out from all device other then yours"
            })
    
        }catch(err){
            console.log(err);
            return res.status(400).json({
                message: "Unable to logout"
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const allowedUpdates = ['username', 'age', 'email'];
            const updates = Object.keys(req.body);
            const isValidReq = updates.every((update) => {
                return allowedUpdates.includes(update);
            })
    
            if(!isValidReq){
                throw new Error('Invalid Update Call');
            }
    
            const userId = req.decoded.id;
            // console.log(userId);
            const foundUser = (await pool.query(
                `SELECT * FROM users WHERE id = ${userId}`
            ))[0][0];
     
            if(!foundUser){
                throw new Error('User not found');
            }
    
            updates.forEach((update) => {
                foundUser[update] = req.body[update];
            });
    
            const updatedUser = await pool.query(
                `UPDATE users SET username = '${foundUser.username}', email = '${foundUser.email}', age = ${foundUser.age} WHERE id = ${userId}`
            )
            console.log("Updated user => ", updatedUser);
            if(updatedUser[0]?.affectedRows < 1){
                return res.status(404).json({
                    message: "User Not Found"
                });
            }
    
            return res.status(200).json({
                message: "User Updated",
                data: foundUser
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const id = req.decoded.id;
    
            const deletedResult = await pool.query(`DELETE FROM users WHERE id = ${id}`);
            // console.log(deletedResult);
    
            if(!deletedResult || deletedResult[0]?.affectedRows < 1){
                return res.status(404).json({
                    message: "User Not Found"
                });
            }
    
            return res.status(200).json({
                message: "User Deleted",
                data: deletedResult[0]?.affectedRows || 0
            });
        }catch(err) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }
    }
}