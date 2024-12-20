require('dotenv').config();
const jwt = require('jsonwebtoken');

const fetchadmin = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).send("Please provide a valid token");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin; assuming the token contains a role property
        if (data.user.role !== 'admin') {
            return res.status(403).send("Access denied. Admins only.");
        }

        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token. Please provide a valid token");
    }
};

module.exports = fetchadmin;
