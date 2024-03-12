const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error();
    }
    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      throw new Error();
    }
    req.user = userData;
    console.log(userData);
  } catch (e) {
    res.status(400).json({ message: "invalid token in auth middle" });
    console.log(e);
  }

  next();
};
