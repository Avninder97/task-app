const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    encryptor: async (password) => {
        try {
            const hash = await bcrypt.hash(password, 8);
            return hash;
        }catch(err){
            throw new Error('Encryptor error');
        }
    },
    verifier: async (password, hash) => {
        try {
            const match = await bcrypt.compare(password, hash);
            console.log(match)
            if(!match){
                return false;
            }
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    },
    createToken: async (id) => {
        const token = jwt.sign({ id: id }, process.env.JWTSECRET);
        return token;
    },
    decodeToken: async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWTSECRET);
            return decoded;
        }catch(err){
            throw new Error('decoding error');
        }
    }
}