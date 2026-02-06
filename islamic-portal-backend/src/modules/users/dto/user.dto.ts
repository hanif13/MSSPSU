import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ enum: ['admin', 'editor', 'writer'] })
    @IsEnum(['admin', 'editor', 'writer'])
    @IsOptional()
    role?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatar?: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @ApiPropertyOptional({ enum: ['admin', 'editor', 'writer'] })
    @IsEnum(['admin', 'editor', 'writer'])
    @IsOptional()
    role?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiPropertyOptional()
    @IsOptional()
    isActive?: boolean;
}

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}
