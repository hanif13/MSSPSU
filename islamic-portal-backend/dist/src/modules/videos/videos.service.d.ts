import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.schema';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class VideosService {
    private videoModel;
    private auditLogsService;
    constructor(videoModel: Model<VideoDocument>, auditLogsService: AuditLogsService);
    create(createVideoDto: CreateVideoDto): Promise<Video>;
    findAll(status?: string): Promise<Video[]>;
    findPublished(): Promise<Video[]>;
    findOne(id: string): Promise<Video>;
    findBySlug(slug: string): Promise<Video>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<Video>;
}
