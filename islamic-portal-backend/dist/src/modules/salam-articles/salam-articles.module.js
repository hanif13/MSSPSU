"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalamArticlesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const salam_articles_controller_1 = require("./salam-articles.controller");
const salam_articles_service_1 = require("./salam-articles.service");
const salam_article_schema_1 = require("./salam-article.schema");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
let SalamArticlesModule = class SalamArticlesModule {
};
exports.SalamArticlesModule = SalamArticlesModule;
exports.SalamArticlesModule = SalamArticlesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: salam_article_schema_1.SalamArticle.name, schema: salam_article_schema_1.SalamArticleSchema }]),
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [salam_articles_controller_1.SalamArticlesController],
        providers: [salam_articles_service_1.SalamArticlesService],
        exports: [salam_articles_service_1.SalamArticlesService],
    })
], SalamArticlesModule);
//# sourceMappingURL=salam-articles.module.js.map