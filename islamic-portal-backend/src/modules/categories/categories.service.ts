import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Article, ArticleDocument } from '../articles/article.schema';
import { Video, VideoDocument } from '../videos/video.schema';
import { Journal, JournalDocument } from '../journals/journal.schema';
import { SalamArticle, SalamArticleDocument } from '../salam-articles/salam-article.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
        @InjectModel(SalamArticle.name) private salamArticleModel: Model<SalamArticleDocument>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = new this.categoryModel(createCategoryDto);
        return category.save();
    }

    async findAll(type?: string): Promise<any[]> {
        const query = type ? { type, isActive: true } : { isActive: true };
        const categories = await this.categoryModel.find(query).sort({ name: 1 }).lean().exec();

        const results = await Promise.all(categories.map(async (cat) => {
            let contentCount = 0;
            switch (cat.type) {
                case 'article':
                    contentCount = await this.articleModel.countDocuments({ category: cat.name });
                    break;
                case 'video':
                    contentCount = await this.videoModel.countDocuments({ category: cat.name });
                    break;
                case 'journal':
                    contentCount = await this.journalModel.countDocuments({ category: cat.name });
                    break;
                case 'salam':
                    contentCount = await this.salamArticleModel.countDocuments({ category: cat.name });
                    break;
            }
            return { ...cat, contentCount };
        }));

        return results;
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }

    async findBySlug(slug: string): Promise<Category> {
        const category = await this.categoryModel.findOne({ slug }).exec();
        if (!category) {
            throw new NotFoundException(`Category with slug "${slug}" not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();
        if (!category) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }
    }
}
