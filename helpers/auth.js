const ensureAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.json({
        message: "You should log in or sign up to create a lobby"
    })
}

module.exports = {
    ensureAuth
}