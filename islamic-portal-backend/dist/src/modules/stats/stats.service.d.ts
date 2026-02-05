import { Model } from 'mongoose';
import { ArticleDocument } from '../articles/article.schema';
import { VideoDocument } from '../videos/video.schema';
import { JournalDocument } from '../journals/journal.schema';
import { SalamArticleDocument } from '../salam-articles/salam-article.schema';
import { UserDocument } from '../users/user.schema';
export declare class StatsService {
    private articleModel;
    private videoModel;
    private journalModel;
    private salamArticleModel;
    private userModel;
    constructor(articleModel: Model<ArticleDocument>, videoModel: Model<VideoDocument>, journalModel: Model<JournalDocument>, salamArticleModel: Model<SalamArticleDocument>, userModel: Model<UserDocument>);
    getDashboardStats(): Promise<{
        counts: {
            articles: number;
            videos: number;
            journals: number;
            salamArticles: number;
            users: number;
        };
        pending: {
            total: number;
            articles: number;
            videos: number;
            journals: number;
            salamArticles: number;
        };
        totalContent: number;
    }>;
}
