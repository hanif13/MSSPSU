import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private auditLogsService: AuditLogsService,
    ) { }

    async create(createArticleDto: CreateArticleDto): Promise<Article> {
        // Auto-generate publishedAt if not provided
        if (!createArticleDto.publishedAt) {
            const now = new Date();
            createArticleDto.publishedAt = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        const article = new this.articleModel(createArticleDto);
        const savedArticle = await article.save();

        await this.auditLogsService.createLog({
            action: 'CREATE_ARTICLE',
            module: 'Articles',
            user: 'Admin', // Hardcoded for now
            details: `Created article: ${savedArticle.title}`,
        });

        return savedArticle;
    }

    async findAll(status?: string): Promise<Article[]> {
        const query = status ? { status } : {};
        return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findPublished(): Promise<Article[]> {
        return this.articleModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new NotFoundException(`Article with ID "${id}" not found`);
        }
        return article;
    }

    async findBySlug(slug: string): Promise<Article> {
        const article = await this.articleModel
            .findOneAndUpdate(
                { slug },
                { $inc: { views: 1 } },
                { new: true }
            )
            .exec();
        if (!article) {
            throw new NotFoundException(`Article with slug "${slug}" not found`);
        }
        return article;
    }

    async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
        const article = await this.articleModel
            .findByIdAndUpdate(id, updateArticleDto, { new: true })
            .exec();
        if (!article) {
            throw new NotFoundException(`Article with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: 'UPDATE_ARTICLE',
            module: 'Articles',
            user: 'Admin',
            details: `Updated article: ${article.title}`,
        });

        return article;
    }

    async remove(id: string): Promise<void> {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new NotFoundException(`Article with ID "${id}" not found`);
        }

        await this.articleModel.findByIdAndDelete(id).exec();

        await this.auditLogsService.createLog({
            action: 'DELETE_ARTICLE',
            module: 'Articles',
            user: 'Admin',
            details: `Deleted article: ${article.title}`,
        });
    }

    async updateStatus(id: string, status: string): Promise<Article> {
        const article = await this.articleModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!article) {
            throw new NotFoundException(`Article with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Articles',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} article: ${article.title}`,
        });

        return article;
    }
}
