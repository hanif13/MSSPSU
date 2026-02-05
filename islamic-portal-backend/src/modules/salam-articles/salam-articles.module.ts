import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalamArticlesController } from './salam-articles.controller';
import { SalamArticlesService } from './salam-articles.service';
import { SalamArticle, SalamArticleSchema } from './salam-article.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SalamArticle.name, schema: SalamArticleSchema }]),
        AuditLogsModule,
    ],
    controllers: [SalamArticlesController],
    providers: [SalamArticlesService],
    exports: [SalamArticlesService],
})
export class SalamArticlesModule { }
