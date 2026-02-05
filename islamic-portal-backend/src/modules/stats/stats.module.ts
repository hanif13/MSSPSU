import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Article, ArticleSchema } from '../articles/article.schema';
import { Video, VideoSchema } from '../videos/video.schema';
import { Journal, JournalSchema } from '../journals/journal.schema';
import { SalamArticle, SalamArticleSchema } from '../salam-articles/salam-article.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
            { name: Video.name, schema: VideoSchema },
            { name: Journal.name, schema: JournalSchema },
            { name: SalamArticle.name, schema: SalamArticleSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule { }
