"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const articles_module_1 = require("./modules/articles/articles.module");
const videos_module_1 = require("./modules/videos/videos.module");
const journals_module_1 = require("./modules/journals/journals.module");
const salam_articles_module_1 = require("./modules/salam-articles/salam-articles.module");
const users_module_1 = require("./modules/users/users.module");
const categories_module_1 = require("./modules/categories/categories.module");
const stats_module_1 = require("./modules/stats/stats.module");
const audit_logs_module_1 = require("./modules/audit-logs/audit-logs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            articles_module_1.ArticlesModule,
            videos_module_1.VideosModule,
            journals_module_1.JournalsModule,
            salam_articles_module_1.SalamArticlesModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            stats_module_1.StatsModule,
            audit_logs_module_1.AuditLogsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map