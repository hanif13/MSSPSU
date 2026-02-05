import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<Omit<import("./user.schema").User, "password">>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<import("./user.schema").User, "password">;
        token: string;
    }>;
    findAll(): Promise<Omit<import("./user.schema").User, "password">[]>;
    findOne(id: string): Promise<Omit<import("./user.schema").User, "password">>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<import("./user.schema").User, "password">>;
    remove(id: string): Promise<void>;
}
