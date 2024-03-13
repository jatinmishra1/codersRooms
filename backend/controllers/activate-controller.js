const Jimp = require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");
class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;
    console.log("here is the name and the avatar", name, avatar);
    if (!name || !avatar) {
      res.status(400).json({ message: "all fields are required" });
    }
    //image base64 conversion

    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
      const Jimpres = await Jimp.read(buffer);
      Jimpres.resize(150, Jimp.AUTO).write(
        path.resolve(__dirname, `../storage/${imagePath}`)
      );
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "could not process the image" });
    }

    //update user
    const userId = req.user._id;

    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) {
        res.status(400).json({ message: "user not found" });
      }
      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagePath}`;
      user.save();
      res.json({ user: new UserDto(user), auth: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "something went wrong" });
    }
  }
}

module.exports = new ActivateController();
