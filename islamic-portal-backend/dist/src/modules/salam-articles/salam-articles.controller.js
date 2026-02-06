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
exports.SalamArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salam_articles_service_1 = require("./salam-articles.service");
const salam_article_dto_1 = require("./dto/salam-article.dto");
let SalamArticlesController = class SalamArticlesController {
    salamArticlesService;
    constructor(salamArticlesService) {
        this.salamArticlesService = salamArticlesService;
    }
    create(createDto) {
        return this.salamArticlesService.create(createDto);
    }
    findAll(status) {
        return this.salamArticlesService.findAll(status);
    }
    findPublished() {
        return this.salamArticlesService.findPublished();
    }
    findBySlug(slug) {
        return this.salamArticlesService.findBySlug(slug);
    }
    findOne(id) {
        return this.salamArticlesService.findOne(id);
    }
    update(id, updateDto) {
        return this.salamArticlesService.update(id, updateDto);
    }
    updateStatus(id, status) {
        return this.salamArticlesService.updateStatus(id, status);
    }
    remove(id) {
        return this.salamArticlesService.remove(id);
    }
};
exports.SalamArticlesController = SalamArticlesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new salam article' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salam_article_dto_1.CreateSalamArticleDto]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all salam articles' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('published'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all published salam articles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get salam article by slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get salam article by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update salam article' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, salam_article_dto_1.UpdateSalamArticleDto]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update salam article status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete salam article' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalamArticlesController.prototype, "remove", null);
exports.SalamArticlesController = SalamArticlesController = __decorate([
    (0, swagger_1.ApiTags)('Salam Articles'),
    (0, common_1.Controller)('salam-articles'),
    __metadata("design:paramtypes", [salam_articles_service_1.SalamArticlesService])
], SalamArticlesController);
//# sourceMappingURL=salam-articles.controller.js.map