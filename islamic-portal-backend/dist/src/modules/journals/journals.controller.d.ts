import { JournalsService } from './journals.service';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
export declare class JournalsController {
    private readonly journalsService;
    constructor(journalsService: JournalsService);
    create(createJournalDto: CreateJournalDto): Promise<import("./journal.schema").Journal>;
    findAll(status?: string): Promise<import("./journal.schema").Journal[]>;
    findPublished(): Promise<import("./journal.schema").Journal[]>;
    findBySlug(slug: string): Promise<import("./journal.schema").Journal>;
    findOne(id: string): Promise<import("./journal.schema").Journal>;
    update(id: string, updateJournalDto: UpdateJournalDto): Promise<import("./journal.schema").Journal>;
    updateStatus(id: string, status: string): Promise<import("./journal.schema").Journal>;
    remove(id: string): Promise<void>;
}
