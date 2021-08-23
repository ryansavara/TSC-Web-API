import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO } from 'src/auth/auth.dto';
import { UpdateUser, User, UserDTO } from './users.model';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private sanitizeUser(user: User) {
    let ret = user.toObject();
    delete ret.password;
    return ret;
  }

  async findByPayload(payload: any) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findByLogin(userDTO: LoginDTO) {
    const { email, password } = userDTO;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException();
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new UnauthorizedException('Email and password do not match.');
    }
  }

  async insertUser(userDTO: User) {
    const { email } = userDTO;
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (user) {
        throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
      }
      const newUser = new this.userModel({
        name: userDTO.name,
        email: userDTO.email,
        password: userDTO.password,
        enabled: userDTO.enabled,
      });
      const result = await newUser.save();
      return result.id as string;
    } catch (err) {
      throw new BadRequestException(`Error saving new user: ${err.message}`);
    }
  }

  async getAllUsers() {
    try {
      return await this.userModel.find().exec();
    } catch (err) {
      this.logger.error(`Error getting all users: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.findUser(userId);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        enabled: user.enabled,
        registeredAt: user.registeredAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      };
    } catch (err) {
      if (err.status === 404) {
        return new NotFoundException();
      }
      this.logger.error(`Error getting user by id: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(userId: string, userDTO: User) {
    try {
      const updatedUser = await this.findUser(userId);
      updatedUser.name = userDTO.name;
      updatedUser.email = userDTO.email;
      if (userDTO.password) {
        updatedUser.password = userDTO.password;
      }
      updatedUser.enabled = userDTO.enabled;

      updatedUser.save();
    } catch (err) {
      this.logger.error(`Error updating user: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  async updateSelfUser(userId: string, userDTO: UpdateUser) {
    try {
      const user = await this.userModel
        .findOne({ _id: userId })
        .select('+password');
      if (!user) {
        throw new UnauthorizedException();
      }

      if (await bcrypt.compare(userDTO.password, user.password)) {
        let updatedUser = user;
        updatedUser.password = userDTO.newPassword;
        await updatedUser.save();
        return { updatedUser };
      } else {
        throw new UnauthorizedException('Email and password do not match.');
      }
    } catch (err) {
      this.logger.error(`Error updating self: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(userId: string) {
    try {
      const updatedUser = await this.findUser(userId);
      updatedUser.enabled = false;
      updatedUser.deletedAt = new Date();

      updatedUser.save();
    } catch (err) {
      this.logger.error(`Error deleting user: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  private async findUser(userId: string) {
    let user: User;
    try {
      user = await this.userModel.findById(userId).exec();
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
