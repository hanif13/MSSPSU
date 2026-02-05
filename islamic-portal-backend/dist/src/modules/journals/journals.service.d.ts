import { Model } from 'mongoose';
import { Journal, JournalDocument } from './journal.schema';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class JournalsService {
    private journalModel;
    private auditLogsService;
    constructor(journalModel: Model<JournalDocument>, auditLogsService: AuditLogsService);
    create(createJournalDto: CreateJournalDto): Promise<Journal>;
    findAll(status?: string): Promise<Journal[]>;
    findPublished(): Promise<Journal[]>;
    findOne(id: string): Promise<Journal>;
    findBySlug(slug: string): Promise<Journal>;
    update(id: string, updateJournalDto: UpdateJournalDto): Promise<Journal>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<Journal>;
}
