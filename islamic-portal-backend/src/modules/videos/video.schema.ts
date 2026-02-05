import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
    @ApiProperty()
    @Prop({ required: true })
    title: string;

    @ApiProperty()
    @Prop({ required: true })
    excerpt: string;

    @ApiProperty()
    @Prop({ required: true })
    description: string;

    @ApiProperty()
    @Prop({ required: true })
    category: string;

    @ApiProperty()
    @Prop({ required: true })
    author: string;

    @ApiProperty()
    @Prop()
    authorTitle: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    slug: string;

    @ApiProperty()
    @Prop()
    duration: string;

    @ApiProperty()
    @Prop()
    views: string;

    @ApiProperty()
    @Prop()
    publishedAt: string;

    @ApiProperty()
    @Prop()
    youtubeUrl: string;

    @ApiProperty()
    @Prop()
    coverImage: string;

    @ApiProperty()
    @Prop({ default: 'draft', enum: ['draft', 'pending', 'published', 'rejected'] })
    status: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
