import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userData: {
    username: string;
    email: string;
    password: string;
    roles: string[];
  }): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateRefreshToken(userId: string, rt: string): Promise<void> {
  await this.userModel.findByIdAndUpdate(userId, { refreshToken: rt });
}

async removeRefreshToken(userId: string): Promise<void> {
  await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
}
}
