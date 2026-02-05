import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVideoDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    excerpt: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    authorTitle?: string;

    @ApiProperty()
    @IsString()
    slug: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    duration?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    views?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    publishedAt?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    youtubeUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiPropertyOptional({ enum: ['draft', 'pending', 'published', 'rejected'] })
    @IsEnum(['draft', 'pending', 'published', 'rejected'])
    @IsOptional()
    status?: string;
}

export class UpdateVideoDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    excerpt?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    author?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    authorTitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    duration?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    views?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    publishedAt?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    youtubeUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiPropertyOptional({ enum: ['draft', 'pending', 'published', 'rejected'] })
    @IsEnum(['draft', 'pending', 'published', 'rejected'])
    @IsOptional()
    status?: string;
}
