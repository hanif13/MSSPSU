import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';

@Injectable()
export class AuditLogsService {
    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    ) { }

    async createLog(data: {
        action: string;
        module: string;
        user: string;
        role?: string;
        details?: string;
        metadata?: string;
    }) {
        const newLog = new this.auditLogModel(data);
        return newLog.save();
    }

    async findAll() {
        return this.auditLogModel.find().sort({ createdAt: -1 }).exec();
    }

    async findRecent(limit: number = 10) {
        return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).exec();
    }
}
