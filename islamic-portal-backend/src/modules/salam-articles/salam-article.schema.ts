import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SalamArticleDocument = SalamArticle & Document;

@Schema({ timestamps: true })
export class SalamArticle {
    @ApiProperty()
    @Prop({ required: true })
    title: string;

    @ApiProperty()
    @Prop({ required: true })
    excerpt: string;

    @ApiProperty()
    @Prop({ required: true })
    content: string;

    @ApiProperty()
    @Prop({ required: true })
    category: string;

    @ApiProperty()
    @Prop({ required: true })
    author: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    slug: string;

    @ApiProperty()
    @Prop()
    icon: string;

    @ApiProperty()
    @Prop()
    publishedAt: string;

    @ApiProperty()
    @Prop()
    coverImage: string;

    @ApiProperty({ description: 'View count' })
    @Prop({ default: 0 })
    views: number;

    @ApiProperty()
    @Prop({ default: 'draft', enum: ['draft', 'pending', 'published', 'rejected'] })
    status: string;
}

export const SalamArticleSchema = SchemaFactory.createForClass(SalamArticle);
