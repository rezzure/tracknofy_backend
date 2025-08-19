require("dotenv").config(); 
const secretCode = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

const verification = (req, res, next) => {
    const token = req.headers['token'] || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);;

    if (!token) {
        return res.status(401).send({
            success: false,
            message: "token is missing"
        });
    }
    try {
        const isVerify = jwt.verify(token, secretCode);
        req.user = isVerify.id || isVerify._id;
        next();
    } catch (err) {
        return res.status(401).send({
            success: false,
            message: "token is not valid"
        });
    }
};

module.exports = verification;