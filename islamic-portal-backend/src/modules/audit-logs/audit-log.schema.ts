import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
    @ApiProperty({ description: 'The action performed (e.g., CREATE_ARTICLE, DELETE_USER)' })
    @Prop({ required: true })
    action: string;

    @ApiProperty({ description: 'The module where the action occurred' })
    @Prop({ required: true })
    module: string;

    @ApiProperty({ description: 'The user who performed the action' })
    @Prop({ required: true })
    user: string;

    @ApiProperty({ description: 'The role of the user' })
    @Prop()
    role: string;

    @ApiProperty({ description: 'Detailed description of the change' })
    @Prop()
    details: string;

    @ApiProperty({ description: 'IP address or other metadata' })
    @Prop()
    metadata: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
