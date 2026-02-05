import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
    @ApiProperty({ description: 'Article title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Short excerpt' })
    @IsString()
    excerpt: string;

    @ApiProperty({ description: 'Full content (markdown)' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Category name' })
    @IsString()
    category: string;

    @ApiProperty({ description: 'Author name' })
    @IsString()
    author: string;

    @ApiPropertyOptional({ description: 'Author title/position' })
    @IsString()
    @IsOptional()
    authorTitle?: string;

    @ApiProperty({ description: 'URL slug' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ description: 'Published date' })
    @IsString()
    @IsOptional()
    publishedAt?: string;

    @ApiPropertyOptional({ description: 'Estimated read time' })
    @IsString()
    @IsOptional()
    readTime?: string;

    @ApiPropertyOptional({ description: 'Cover image URL' })
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiPropertyOptional({ description: 'Status', enum: ['draft', 'pending', 'published', 'rejected'] })
    @IsEnum(['draft', 'pending', 'published', 'rejected'])
    @IsOptional()
    status?: string;
}

export class UpdateArticleDto {
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
    content?: string;

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
    publishedAt?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readTime?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    views?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiPropertyOptional({ enum: ['draft', 'pending', 'published', 'rejected'] })
    @IsEnum(['draft', 'pending', 'published', 'rejected'])
    @IsOptional()
    status?: string;
}
