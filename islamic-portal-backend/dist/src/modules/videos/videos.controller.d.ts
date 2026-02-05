import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    create(createVideoDto: CreateVideoDto): Promise<import("./video.schema").Video>;
    findAll(status?: string): Promise<import("./video.schema").Video[]>;
    findPublished(): Promise<import("./video.schema").Video[]>;
    findOne(id: string): Promise<import("./video.schema").Video>;
    findBySlug(slug: string): Promise<import("./video.schema").Video>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<import("./video.schema").Video>;
    updateStatus(id: string, status: string): Promise<import("./video.schema").Video>;
    remove(id: string): Promise<void>;
}
