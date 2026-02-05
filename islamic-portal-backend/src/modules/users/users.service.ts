import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto/user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    // Simple hash function (use bcrypt in production)
    private hashPassword(password: string): string {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const user = new this.userModel({
            ...createUserDto,
            password: this.hashPassword(createUserDto.password),
        });
        const savedUser = await user.save();
        const { password, ...result } = savedUser.toObject();
        return result;
    }

    async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
        const user = await this.userModel.findOne({ email: loginDto.email }).exec();
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const hashedPassword = this.hashPassword(loginDto.password);
        if (user.password !== hashedPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        const { password, ...userResult } = user.toObject();

        // Simple token (use JWT in production)
        const token = crypto.randomBytes(32).toString('hex');

        return { user: userResult, token };
    }

    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.userModel.find().select('-password').exec();
        return users;
    }

    async findOne(id: string): Promise<Omit<User, 'password'>> {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        if (updateUserDto.password) {
            updateUserDto.password = this.hashPassword(updateUserDto.password);
        }

        const user = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .select('-password')
            .exec();
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
    }
}
