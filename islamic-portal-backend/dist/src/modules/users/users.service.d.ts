import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto/user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    private hashPassword;
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    findOne(id: string): Promise<Omit<User, 'password'>>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>>;
    remove(id: string): Promise<void>;
}
