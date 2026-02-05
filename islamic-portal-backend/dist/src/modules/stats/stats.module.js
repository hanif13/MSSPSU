"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const stats_controller_1 = require("./stats.controller");
const stats_service_1 = require("./stats.service");
const article_schema_1 = require("../articles/article.schema");
const video_schema_1 = require("../videos/video.schema");
const journal_schema_1 = require("../journals/journal.schema");
const salam_article_schema_1 = require("../salam-articles/salam-article.schema");
const user_schema_1 = require("../users/user.schema");
let StatsModule = class StatsModule {
};
exports.StatsModule = StatsModule;
exports.StatsModule = StatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: article_schema_1.Article.name, schema: article_schema_1.ArticleSchema },
                { name: video_schema_1.Video.name, schema: video_schema_1.VideoSchema },
                { name: journal_schema_1.Journal.name, schema: journal_schema_1.JournalSchema },
                { name: salam_article_schema_1.SalamArticle.name, schema: salam_article_schema_1.SalamArticleSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [stats_controller_1.StatsController],
        providers: [stats_service_1.StatsService],
    })
], StatsModule);
//# sourceMappingURL=stats.module.js.map