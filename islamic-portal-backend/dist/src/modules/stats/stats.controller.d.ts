import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
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
