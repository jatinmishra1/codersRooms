const OtpService = require("../services/otp-service");
const HashService = require("../services/hash-service");
const otpService = require("../services/otp-service");
const UserService = require("../services/user-service");
const userService = require("../services/user-service");
const TokenService = require("../services/token-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");
class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ message: "phone field is required" });
    }
    const otp = await OtpService.generateOtp();

    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires} `;
    const hash = HashService.hashOtp(data);

    //send otp
    console.log("phone is here", phone);
    try {
      // await OtpService.sendBySms(phone, otp);
      res.json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      });
    } catch (e) {
      console.log("error while sending otp ", e);
      res.status(500).json({ message: "otp sending failed" });
    }
  }

  async varifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if ((!otp, !hash, !phone)) {
      return req.status(400).json({ message: "all fields are required" });
    }
    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      return res.status(400).json({ message: "otp expired" });
    }
    const data = `${phone}.${otp}.${expires} `;
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    let user;

    try {
      user = await userService.findUser({ phone: phone });
      if (!user) {
        user = await userService.createUser({ phone: phone });
      }
    } catch (e) {
      console.log("user not crated or find", e);
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 6 * 60 * 24 * 30,
      httpOnly: true,
    });
    const userDto = new UserDto(user);
    return res.json({ accessToken, user: userDto });
  }
}

module.exports = new AuthController();
