import UserModel, { User } from '../models/User.model';

class UserRepository {
  async createUser(userData: Partial<User>): Promise<User> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(id, user, { new: true });
  }
}

export default new UserRepository();
