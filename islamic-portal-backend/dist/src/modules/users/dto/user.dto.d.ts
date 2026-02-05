export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    avatar?: string;
    isActive?: boolean;
}
export declare class LoginDto {
    email: string;
    password: string;
}
