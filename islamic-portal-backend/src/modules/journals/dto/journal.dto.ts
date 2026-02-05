import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJournalDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    excerpt: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsString()
    slug: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    issue?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    pdfUrl?: string;

    @ApiPropertyOptional({ enum: ['draft', 'pending', 'published', 'rejected'] })
    @IsEnum(['draft', 'pending', 'published', 'rejected'])
    @IsOptional()
    status?: string;
}

export class UpdateJournalDto {
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
    slug?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    issue?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    pdfUrl?: string;

    @ApiPropertyOptional({ enum: ['draft', 'pending', 'published', 'rejected'] })
    @IsEnum(['draft', 'pending', 'published', 'rejected'])
    @IsOptional()
    status?: string;
}
