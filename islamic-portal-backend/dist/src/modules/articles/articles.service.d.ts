import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class ArticlesService {
    private articleModel;
    private auditLogsService;
    constructor(articleModel: Model<ArticleDocument>, auditLogsService: AuditLogsService);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(status?: string): Promise<Article[]>;
    findPublished(): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    findBySlug(slug: string): Promise<Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<Article>;
}
