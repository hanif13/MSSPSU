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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./category.schema");
const article_schema_1 = require("../articles/article.schema");
const video_schema_1 = require("../videos/video.schema");
const journal_schema_1 = require("../journals/journal.schema");
const salam_article_schema_1 = require("../salam-articles/salam-article.schema");
let CategoriesService = class CategoriesService {
    categoryModel;
    articleModel;
    videoModel;
    journalModel;
    salamArticleModel;
    constructor(categoryModel, articleModel, videoModel, journalModel, salamArticleModel) {
        this.categoryModel = categoryModel;
        this.articleModel = articleModel;
        this.videoModel = videoModel;
        this.journalModel = journalModel;
        this.salamArticleModel = salamArticleModel;
    }
    async create(createCategoryDto) {
        const category = new this.categoryModel(createCategoryDto);
        return category.save();
    }
    async findAll(type) {
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
    async findOne(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.categoryModel.findOne({ slug }).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }
    async remove(id) {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __param(2, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(3, (0, mongoose_1.InjectModel)(journal_schema_1.Journal.name)),
    __param(4, (0, mongoose_1.InjectModel)(salam_article_schema_1.SalamArticle.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map