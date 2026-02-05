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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("../articles/article.schema");
const video_schema_1 = require("../videos/video.schema");
const journal_schema_1 = require("../journals/journal.schema");
const salam_article_schema_1 = require("../salam-articles/salam-article.schema");
const user_schema_1 = require("../users/user.schema");
let StatsService = class StatsService {
    articleModel;
    videoModel;
    journalModel;
    salamArticleModel;
    userModel;
    constructor(articleModel, videoModel, journalModel, salamArticleModel, userModel) {
        this.articleModel = articleModel;
        this.videoModel = videoModel;
        this.journalModel = journalModel;
        this.salamArticleModel = salamArticleModel;
        this.userModel = userModel;
    }
    async getDashboardStats() {
        const [articles, videos, journals, salamArticles, users, pendingArticles, pendingVideos, pendingJournals, pendingSalam] = await Promise.all([
            this.articleModel.countDocuments(),
            this.videoModel.countDocuments(),
            this.journalModel.countDocuments(),
            this.salamArticleModel.countDocuments(),
            this.userModel.countDocuments(),
            this.articleModel.countDocuments({ status: 'pending' }),
            this.videoModel.countDocuments({ status: 'pending' }),
            this.journalModel.countDocuments({ status: 'pending' }),
            this.salamArticleModel.countDocuments({ status: 'pending' }),
        ]);
        return {
            counts: {
                articles,
                videos,
                journals,
                salamArticles,
                users,
            },
            pending: {
                total: pendingArticles + pendingVideos + pendingJournals + pendingSalam,
                articles: pendingArticles,
                videos: pendingVideos,
                journals: pendingJournals,
                salamArticles: pendingSalam,
            },
            totalContent: articles + videos + journals + salamArticles,
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __param(1, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(2, (0, mongoose_1.InjectModel)(journal_schema_1.Journal.name)),
    __param(3, (0, mongoose_1.InjectModel)(salam_article_schema_1.SalamArticle.name)),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StatsService);
//# sourceMappingURL=stats.service.js.map