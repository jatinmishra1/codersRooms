const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    phone: { type: String, require: true },
    activated: { type: Boolean, default: false, require: false },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema, "users");
