const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign({ username: user.username, id: user.id },
        "replacewithsecretToken"
    );

    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if (!accessToken)
        return res.status(400).json({ error: "User not Authenticated" });
    try {
        const validToken = verify(accessToken, "replacewithsecretToken")
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        return req.status(400).json({ error: err })
    }

}
module.exports = { createTokens, validateToken };