const jwt = require('jsonwebtoken');
require("dotenv").config();

const authmiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.json({ message: "Access denied, please provide a valid token." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: "An error occured.", error: e.message })
    }
}

module.exports = authmiddleware;