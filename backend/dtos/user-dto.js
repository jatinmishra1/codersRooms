class UserDto {
  id;
  phone;
  activated;
  createdAt;
  name;
  avatar;

  constructor(user) {
    this.id = user._id;
    this.phone = user.phone;
    this.createdAt = user.createdAt;
    this.activated = user.activated;
    this.name = user.name;
    this.avatar = user.avatar;
  }
}

module.exports = UserDto;
