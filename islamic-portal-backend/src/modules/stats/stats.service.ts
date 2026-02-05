import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../articles/article.schema';
import { Video, VideoDocument } from '../videos/video.schema';
import { Journal, JournalDocument } from '../journals/journal.schema';
import { SalamArticle, SalamArticleDocument } from '../salam-articles/salam-article.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
        @InjectModel(SalamArticle.name) private salamArticleModel: Model<SalamArticleDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async getDashboardStats() {
        const [
            articles,
            videos,
            journals,
            salamArticles,
            users,
            pendingArticles,
            pendingVideos,
            pendingJournals,
            pendingSalam
        ] = await Promise.all([
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
}
