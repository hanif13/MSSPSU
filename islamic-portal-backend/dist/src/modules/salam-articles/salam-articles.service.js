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
exports.SalamArticlesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const salam_article_schema_1 = require("./salam-article.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let SalamArticlesService = class SalamArticlesService {
    salamArticleModel;
    auditLogsService;
    constructor(salamArticleModel, auditLogsService) {
        this.salamArticleModel = salamArticleModel;
        this.auditLogsService = auditLogsService;
    }
    async create(createDto) {
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
    async findAll(status) {
        const query = status ? { status } : {};
        return this.salamArticleModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findPublished() {
        return this.salamArticleModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const article = await this.salamArticleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`SalamArticle with ID "${id}" not found`);
        }
        return article;
    }
    async findBySlug(slug) {
        const article = await this.salamArticleModel
            .findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
            .exec();
        if (!article) {
            throw new common_1.NotFoundException(`SalamArticle with slug "${slug}" not found`);
        }
        return article;
    }
    async update(id, updateDto) {
        const article = await this.salamArticleModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
        if (!article) {
            throw new common_1.NotFoundException(`SalamArticle with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: 'UPDATE_SALAM',
            module: 'Salam Articles',
            user: 'Admin',
            details: `Updated salam article: ${article.title}`,
        });
        return article;
    }
    async remove(id) {
        const article = await this.salamArticleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`SalamArticle with ID "${id}" not found`);
        }
        await this.salamArticleModel.findByIdAndDelete(id).exec();
        await this.auditLogsService.createLog({
            action: 'DELETE_SALAM',
            module: 'Salam Articles',
            user: 'Admin',
            details: `Deleted salam article: ${article.title}`,
        });
    }
    async updateStatus(id, status) {
        const article = await this.salamArticleModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!article) {
            throw new common_1.NotFoundException(`SalamArticle with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Salam Articles',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} salam article: ${article.title}`,
        });
        return article;
    }
};
exports.SalamArticlesService = SalamArticlesService;
exports.SalamArticlesService = SalamArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(salam_article_schema_1.SalamArticle.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], SalamArticlesService);
//# sourceMappingURL=salam-articles.service.js.map