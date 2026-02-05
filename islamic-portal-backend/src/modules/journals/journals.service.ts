import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journal, JournalDocument } from './journal.schema';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class JournalsService {
    constructor(
        @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
        private auditLogsService: AuditLogsService,
    ) { }

    async create(createJournalDto: CreateJournalDto): Promise<Journal> {
        // Auto-generate date if not provided
        if (!createJournalDto.date) {
            const now = new Date();
            createJournalDto.date = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        const journal = new this.journalModel(createJournalDto);
        const savedJournal = await journal.save();

        await this.auditLogsService.createLog({
            action: 'CREATE_JOURNAL',
            module: 'Journals',
            user: 'Admin',
            details: `Created journal: ${savedJournal.title}`,
        });

        return savedJournal;
    }

    async findAll(status?: string): Promise<Journal[]> {
        const query = status ? { status } : {};
        return this.journalModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findPublished(): Promise<Journal[]> {
        return this.journalModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Journal> {
        const journal = await this.journalModel.findById(id).exec();
        if (!journal) {
            throw new NotFoundException(`Journal with ID "${id}" not found`);
        }
        return journal;
    }

    async findBySlug(slug: string): Promise<Journal> {
        const journal = await this.journalModel.findOne({ slug }).exec();
        if (!journal) {
            throw new NotFoundException(`Journal with slug "${slug}" not found`);
        }
        // Increment views
        await this.journalModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
        return journal;
    }

    async update(id: string, updateJournalDto: UpdateJournalDto): Promise<Journal> {
        const journal = await this.journalModel
            .findByIdAndUpdate(id, updateJournalDto, { new: true })
            .exec();
        if (!journal) {
            throw new NotFoundException(`Journal with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: 'UPDATE_JOURNAL',
            module: 'Journals',
            user: 'Admin',
            details: `Updated journal: ${journal.title}`,
        });

        return journal;
    }

    async remove(id: string): Promise<void> {
        const journal = await this.journalModel.findById(id).exec();
        if (!journal) {
            throw new NotFoundException(`Journal with ID "${id}" not found`);
        }

        await this.journalModel.findByIdAndDelete(id).exec();

        await this.auditLogsService.createLog({
            action: 'DELETE_JOURNAL',
            module: 'Journals',
            user: 'Admin',
            details: `Deleted journal: ${journal.title}`,
        });
    }

    async updateStatus(id: string, status: string): Promise<Journal> {
        const journal = await this.journalModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!journal) {
            throw new NotFoundException(`Journal with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Journals',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} journal: ${journal.title}`,
        });

        return journal;
    }
}
