"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("./article.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let ArticlesService = class ArticlesService {
    articleModel;
    auditLogsService;
    constructor(articleModel, auditLogsService) {
        this.articleModel = articleModel;
        this.auditLogsService = auditLogsService;
    }
    async create(createArticleDto) {
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
            user: 'Admin',
            details: `Created article: ${savedArticle.title}`,
        });
        return savedArticle;
    }
    async findAll(status) {
        const query = status ? { status } : {};
        return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findPublished() {
        return this.articleModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID "${id}" not found`);
        }
        return article;
    }
    async findBySlug(slug) {
        const article = await this.articleModel
            .findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
            .exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with slug "${slug}" not found`);
        }
        return article;
    }
    async update(id, updateArticleDto) {
        const article = await this.articleModel
            .findByIdAndUpdate(id, updateArticleDto, { new: true })
            .exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: 'UPDATE_ARTICLE',
            module: 'Articles',
            user: 'Admin',
            details: `Updated article: ${article.title}`,
        });
        return article;
    }
    async remove(id) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID "${id}" not found`);
        }
        await this.articleModel.findByIdAndDelete(id).exec();
        await this.auditLogsService.createLog({
            action: 'DELETE_ARTICLE',
            module: 'Articles',
            user: 'Admin',
            details: `Deleted article: ${article.title}`,
        });
    }
    async updateStatus(id, status) {
        const article = await this.articleModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Articles',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} article: ${article.title}`,
        });
        return article;
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map