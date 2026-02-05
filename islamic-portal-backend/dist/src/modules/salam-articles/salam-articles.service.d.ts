import { Model } from 'mongoose';
import { SalamArticle, SalamArticleDocument } from './salam-article.schema';
import { CreateSalamArticleDto, UpdateSalamArticleDto } from './dto/salam-article.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class SalamArticlesService {
    private salamArticleModel;
    private auditLogsService;
    constructor(salamArticleModel: Model<SalamArticleDocument>, auditLogsService: AuditLogsService);
    create(createDto: CreateSalamArticleDto): Promise<SalamArticle>;
    findAll(status?: string): Promise<SalamArticle[]>;
    findPublished(): Promise<SalamArticle[]>;
    findOne(id: string): Promise<SalamArticle>;
    findBySlug(slug: string): Promise<SalamArticle>;
    update(id: string, updateDto: UpdateSalamArticleDto): Promise<SalamArticle>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<SalamArticle>;
}
