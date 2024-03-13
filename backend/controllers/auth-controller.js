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
    await tokenService.storeRefreshToken(refreshToken, user._id);
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 6 * 60 * 24 * 30,
      httpOnly: true,
    });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 6 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    return res.json({ user: userDto, auth: true });
  }
  // async refresh(req, res) {
  //   //get freresh token from check
  //   const { refreshToken: refreshTokenFromCookies } = req.cookies;
  //   //check token is valid otr not
  //   let userData;
  //   try {
  //     userData = await tokenService.verifyRefreshToken(refreshTokenFromCookies);
  //   } catch (e) {
  //     res.status(401).json({ message: "invalid token" });
  //   }
  //   //check if token is in databse
  //   try {
  //     const token = await tokenService.findRefreshToken(
  //       userData._id,
  //       refreshTokenFromCookies
  //     );
  //     if (!token) {
  //       res.status(401).json({ message: "Invalid token" });
  //     }
  //   } catch (e) {
  //     res.status(500).json({ message: "Internal Error" });
  //   }

  //   // check if VALID USER

  //   const user = await userService.findUser({ _id: userData._id });
  //   if (!user) {
  //     res.satus(404).json({ message: "no user" });
  //   }

  //   //generate new tokens
  //   const { refreshToken, accessToken } = tokenService.generateTokens({
  //     _id: userData._id,
  //   });

  //   //update refresh token
  //   try {
  //     await tokenService.updateRefreshToken(userData._id, refreshToken);
  //   } catch (e) {
  //     return res.status(500).json({ message: "internal error" });
  //   }

  //   //put in cookie
  //   res.cookie("refreshToken", refreshToken, {
  //     maxAge: 1000 * 6 * 60 * 24 * 30,
  //     httpOnly: true,
  //   });
  //   res.cookie("accessToken", accessToken, {
  //     maxAge: 1000 * 6 * 60 * 24 * 30,
  //     httpOnly: true,
  //   });
  //   //response
  //   const userDto = new UserDto(user);
  //   return res.json({ user: userDto, auth: true });
  // }
  async refresh(req, res) {
    // get refresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    // check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    // Check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }
    // check if valid user
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "No user" });
    }
    // Generate new tokens
    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    // Update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }
    // put in cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    // response
    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }

  async logout(req, res) {
    //delete refresh token form cookies
    const { refreshToken } = req.cookies;
    tokenService.removeToken(refreshToken);
    //delte cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ user: null, auth: false });
  }
}

module.exports = new AuthController();
