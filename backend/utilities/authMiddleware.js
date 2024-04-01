module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send(`<h1>You are not authorized to view this resource</h1><br><a href="/login">Login</a>`);
    }
};
