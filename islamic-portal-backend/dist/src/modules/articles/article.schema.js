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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleSchema = exports.Article = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let Article = class Article {
    title;
    excerpt;
    content;
    category;
    author;
    authorTitle;
    slug;
    publishedAt;
    readTime;
    views;
    coverImage;
    status;
};
exports.Article = Article;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Article title' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Short excerpt' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full content (markdown)' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Author name' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Author title/position' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "authorTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL slug' }),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Article.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Published date' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "publishedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated read time' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "readTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'View count' }),
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cover image URL' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Article.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status: draft, pending, published, rejected' }),
    (0, mongoose_1.Prop)({ default: 'draft', enum: ['draft', 'pending', 'published', 'rejected'] }),
    __metadata("design:type", String)
], Article.prototype, "status", void 0);
exports.Article = Article = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Article);
exports.ArticleSchema = mongoose_1.SchemaFactory.createForClass(Article);
//# sourceMappingURL=article.schema.js.map