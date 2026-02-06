import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto): Promise<import("./article.schema").Article>;
    findAll(status?: string): Promise<import("./article.schema").Article[]>;
    findPublished(): Promise<import("./article.schema").Article[]>;
    findBySlug(slug: string): Promise<import("./article.schema").Article>;
    findOne(id: string): Promise<import("./article.schema").Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<import("./article.schema").Article>;
    updateStatus(id: string, status: string): Promise<import("./article.schema").Article>;
    remove(id: string): Promise<void>;
}
