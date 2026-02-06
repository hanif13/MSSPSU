"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const categories_controller_1 = require("./categories.controller");
const categories_service_1 = require("./categories.service");
const category_schema_1 = require("./category.schema");
const article_schema_1 = require("../articles/article.schema");
const video_schema_1 = require("../videos/video.schema");
const journal_schema_1 = require("../journals/journal.schema");
const salam_article_schema_1 = require("../salam-articles/salam-article.schema");
let CategoriesModule = class CategoriesModule {
};
exports.CategoriesModule = CategoriesModule;
exports.CategoriesModule = CategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema },
                { name: video_schema_1.Video.name, schema: video_schema_1.VideoSchema },
                { name: journal_schema_1.Journal.name, schema: journal_schema_1.JournalSchema },
                { name: salam_article_schema_1.SalamArticle.name, schema: salam_article_schema_1.SalamArticleSchema },
            ]),
        ],
        controllers: [categories_controller_1.CategoriesController],
        providers: [categories_service_1.CategoriesService],
        exports: [categories_service_1.CategoriesService],
    })
], CategoriesModule);
//# sourceMappingURL=categories.module.js.map