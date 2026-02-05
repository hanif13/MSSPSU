import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
    @ApiProperty({ description: 'Article title' })
    @Prop({ required: true })
    title: string;

    @ApiProperty({ description: 'Short excerpt' })
    @Prop({ required: true })
    excerpt: string;

    @ApiProperty({ description: 'Full content (markdown)' })
    @Prop({ required: true })
    content: string;

    @ApiProperty({ description: 'Category name' })
    @Prop({ required: true })
    category: string;

    @ApiProperty({ description: 'Author name' })
    @Prop({ required: true })
    author: string;

    @ApiProperty({ description: 'Author title/position' })
    @Prop()
    authorTitle: string;

    @ApiProperty({ description: 'URL slug' })
    @Prop({ required: true, unique: true })
    slug: string;

    @ApiProperty({ description: 'Published date' })
    @Prop()
    publishedAt: string;

    @ApiProperty({ description: 'Estimated read time' })
    @Prop()
    readTime: string;

    @ApiProperty({ description: 'View count' })
    @Prop({ default: 0 })
    views: number;

    @ApiProperty({ description: 'Cover image URL' })
    @Prop()
    coverImage: string;

    @ApiProperty({ description: 'Status: draft, pending, published, rejected' })
    @Prop({ default: 'draft', enum: ['draft', 'pending', 'published', 'rejected'] })
    status: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
