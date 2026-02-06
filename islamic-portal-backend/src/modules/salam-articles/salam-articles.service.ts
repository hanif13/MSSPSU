import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalamArticle, SalamArticleDocument } from './salam-article.schema';
import { CreateSalamArticleDto, UpdateSalamArticleDto } from './dto/salam-article.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SalamArticlesService {
    constructor(
        @InjectModel(SalamArticle.name) private salamArticleModel: Model<SalamArticleDocument>,
        private auditLogsService: AuditLogsService,
    ) { }

    async create(createDto: CreateSalamArticleDto): Promise<SalamArticle> {
        // Auto-generate publishedAt if not provided
        if (!createDto.publishedAt) {
            const now = new Date();
            createDto.publishedAt = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        const article = new this.salamArticleModel(createDto);
        const savedArticle = await article.save();

        await this.auditLogsService.createLog({
            action: 'CREATE_SALAM',
            module: 'Salam Articles',
            user: 'Admin',
            details: `Created salam article: ${savedArticle.title}`,
        });

        return savedArticle;
    }

    async findAll(status?: string): Promise<SalamArticle[]> {
        const query = status ? { status } : {};
        return this.salamArticleModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findPublished(): Promise<SalamArticle[]> {
        return this.salamArticleModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<SalamArticle> {
        const article = await this.salamArticleModel.findById(id).exec();
        if (!article) {
            throw new NotFoundException(`SalamArticle with ID "${id}" not found`);
        }
        return article;
    }

    async findBySlug(slug: string): Promise<SalamArticle> {
        const article = await this.salamArticleModel
            .findOneAndUpdate(
                { slug },
                { $inc: { views: 1 } },
                { new: true }
            )
            .exec();
        if (!article) {
            throw new NotFoundException(`SalamArticle with slug "${slug}" not found`);
        }
        return article;
    }

    async update(id: string, updateDto: UpdateSalamArticleDto): Promise<SalamArticle> {
        const article = await this.salamArticleModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
        if (!article) {
            throw new NotFoundException(`SalamArticle with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: 'UPDATE_SALAM',
            module: 'Salam Articles',
            user: 'Admin',
            details: `Updated salam article: ${article.title}`,
        });

        return article;
    }

    async remove(id: string): Promise<void> {
        const article = await this.salamArticleModel.findById(id).exec();
        if (!article) {
            throw new NotFoundException(`SalamArticle with ID "${id}" not found`);
        }

        await this.salamArticleModel.findByIdAndDelete(id).exec();

        await this.auditLogsService.createLog({
            action: 'DELETE_SALAM',
            module: 'Salam Articles',
            user: 'Admin',
            details: `Deleted salam article: ${article.title}`,
        });
    }

    async updateStatus(id: string, status: string): Promise<SalamArticle> {
        const article = await this.salamArticleModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!article) {
            throw new NotFoundException(`SalamArticle with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Salam Articles',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} salam article: ${article.title}`,
        });

        return article;
    }
}
