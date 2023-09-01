const { decodeToken } = require('../utils/auth');
const pool = require('../utils/db');

module.exports = {
    tokenValidator: async (req, res, next) => {
        try{
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = await decodeToken(token);
            const isLoggedIn = (await pool.query(
                `SELECT * FROM tokens WHERE token = '${token}';`
            ))?.[0][0];

            if(!isLoggedIn){
                return res.status(401).json({
                    message: "Not Authorized"
                })
            }
            req.decoded = decoded;
            req.token = token;
            next();
        }catch(err) {
            console.log(err);
            return res.status(401).json({
                message: "Not Authorized"
            })
        }
    }
}