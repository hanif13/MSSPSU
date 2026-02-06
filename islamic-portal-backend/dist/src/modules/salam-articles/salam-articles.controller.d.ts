import { SalamArticlesService } from './salam-articles.service';
import { CreateSalamArticleDto, UpdateSalamArticleDto } from './dto/salam-article.dto';
export declare class SalamArticlesController {
    private readonly salamArticlesService;
    constructor(salamArticlesService: SalamArticlesService);
    create(createDto: CreateSalamArticleDto): Promise<import("./salam-article.schema").SalamArticle>;
    findAll(status?: string): Promise<import("./salam-article.schema").SalamArticle[]>;
    findPublished(): Promise<import("./salam-article.schema").SalamArticle[]>;
    findBySlug(slug: string): Promise<import("./salam-article.schema").SalamArticle>;
    findOne(id: string): Promise<import("./salam-article.schema").SalamArticle>;
    update(id: string, updateDto: UpdateSalamArticleDto): Promise<import("./salam-article.schema").SalamArticle>;
    updateStatus(id: string, status: string): Promise<import("./salam-article.schema").SalamArticle>;
    remove(id: string): Promise<void>;
}
