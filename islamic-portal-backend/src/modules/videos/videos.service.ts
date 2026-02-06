import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.schema';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class VideosService {
    constructor(
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        private auditLogsService: AuditLogsService,
    ) { }

    async create(createVideoDto: CreateVideoDto): Promise<Video> {
        // Auto-generate publishedAt if not provided
        if (!createVideoDto.publishedAt) {
            const now = new Date();
            createVideoDto.publishedAt = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        const video = new this.videoModel(createVideoDto);
        const savedVideo = await video.save();

        await this.auditLogsService.createLog({
            action: 'CREATE_VIDEO',
            module: 'Videos',
            user: 'Admin',
            details: `Created video: ${savedVideo.title}`,
        });

        return savedVideo;
    }

    async findAll(status?: string): Promise<Video[]> {
        const query = status ? { status } : {};
        return this.videoModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findPublished(): Promise<Video[]> {
        return this.videoModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Video> {
        const video = await this.videoModel.findById(id).exec();
        if (!video) {
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }
        return video;
    }

    async findBySlug(slug: string): Promise<Video> {
        const video = await this.videoModel
            .findOneAndUpdate(
                { slug },
                { $inc: { views: 1 } },
                { new: true }
            )
            .exec();
        if (!video) {
            throw new NotFoundException(`Video with slug "${slug}" not found`);
        }
        return video;
    }

    async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
        const video = await this.videoModel
            .findByIdAndUpdate(id, updateVideoDto, { new: true })
            .exec();
        if (!video) {
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: 'UPDATE_VIDEO',
            module: 'Videos',
            user: 'Admin',
            details: `Updated video: ${video.title}`,
        });

        return video;
    }

    async remove(id: string): Promise<void> {
        const video = await this.videoModel.findById(id).exec();
        if (!video) {
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }

        await this.videoModel.findByIdAndDelete(id).exec();

        await this.auditLogsService.createLog({
            action: 'DELETE_VIDEO',
            module: 'Videos',
            user: 'Admin',
            details: `Deleted video: ${video.title}`,
        });
    }

    async updateStatus(id: string, status: string): Promise<Video> {
        const video = await this.videoModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!video) {
            throw new NotFoundException(`Video with ID "${id}" not found`);
        }

        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Videos',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} video: ${video.title}`,
        });

        return video;
    }
}
