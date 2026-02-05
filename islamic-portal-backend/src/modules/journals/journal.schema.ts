import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type JournalDocument = Journal & Document;

@Schema({ timestamps: true })
export class Journal {
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
    date: string;

    @ApiProperty()
    @Prop()
    issue: string;

    @ApiProperty()
    @Prop()
    coverImage: string;

    @ApiProperty({ description: 'View count' })
    @Prop({ default: 0 })
    views: number;

    @ApiProperty()
    @Prop()
    pdfUrl: string;

    @ApiProperty()
    @Prop({ default: 'draft', enum: ['draft', 'pending', 'published', 'rejected'] })
    status: string;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
