import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ArticleDocument } from '../articles/article.schema';
import { VideoDocument } from '../videos/video.schema';
import { JournalDocument } from '../journals/journal.schema';
import { SalamArticleDocument } from '../salam-articles/salam-article.schema';
export declare class CategoriesService {
    private categoryModel;
    private articleModel;
    private videoModel;
    private journalModel;
    private salamArticleModel;
    constructor(categoryModel: Model<CategoryDocument>, articleModel: Model<ArticleDocument>, videoModel: Model<VideoDocument>, journalModel: Model<JournalDocument>, salamArticleModel: Model<SalamArticleDocument>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(type?: string): Promise<any[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
}
