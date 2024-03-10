const userModal = require("../modals/userModal");

class UserService {
  async findUser(filter) {
    const user = await userModal.findOne(filter);
    return user;
  }

  async createUser(data) {
    const user = userModal.create(data);
    return user;
  }
}

module.exports = new UserService();
