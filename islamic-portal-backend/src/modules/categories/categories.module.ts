import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './category.schema';
import { Article, ArticleSchema } from '../articles/article.schema';
import { Video, VideoSchema } from '../videos/video.schema';
import { Journal, JournalSchema } from '../journals/journal.schema';
import { SalamArticle, SalamArticleSchema } from '../salam-articles/salam-article.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: Article.name, schema: ArticleSchema },
            { name: Video.name, schema: VideoSchema },
            { name: Journal.name, schema: JournalSchema },
            { name: SalamArticle.name, schema: SalamArticleSchema },
        ]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule { }
