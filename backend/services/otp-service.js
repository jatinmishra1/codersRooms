const crypto = require("crypto");
const twilio = require("twilio");
const HashService = require("../services/hash-service");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;

const client = twilio(process.env.SMS_SID, process.env.SMS_AUTH_TOKEN);

class OtpService {
  async generateOtp() {
    const otp = await crypto.randomInt(1000, 9999);
    console.log("your otp is ", otp);
    return otp;
  }
  async sendBySms(phone, otp) {
    console.log("in sendBySms ", phone);
    return client.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `your codersRoom otp is ${otp}`,
    });
  }
  verifyOtp(hashedOtp, data) {
    let computedHashed = HashService.hashOtp(data);
    if (computedHashed === hashedOtp) {
      return true;
    }
    return false;
  }
}

module.exports = new OtpService();
