import User, { IUser } from '../models/User';

class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async updateUser(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, user, { new: true });
  }
}

export default new UserRepository();
