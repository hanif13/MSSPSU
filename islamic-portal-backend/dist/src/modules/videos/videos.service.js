"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_schema_1 = require("./video.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let VideosService = class VideosService {
    videoModel;
    auditLogsService;
    constructor(videoModel, auditLogsService) {
        this.videoModel = videoModel;
        this.auditLogsService = auditLogsService;
    }
    async create(createVideoDto) {
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
    async findAll(status) {
        const query = status ? { status } : {};
        return this.videoModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findPublished() {
        return this.videoModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const video = await this.videoModel.findById(id).exec();
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID "${id}" not found`);
        }
        return video;
    }
    async findBySlug(slug) {
        const video = await this.videoModel
            .findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
            .exec();
        if (!video) {
            throw new common_1.NotFoundException(`Video with slug "${slug}" not found`);
        }
        return video;
    }
    async update(id, updateVideoDto) {
        const video = await this.videoModel
            .findByIdAndUpdate(id, updateVideoDto, { new: true })
            .exec();
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: 'UPDATE_VIDEO',
            module: 'Videos',
            user: 'Admin',
            details: `Updated video: ${video.title}`,
        });
        return video;
    }
    async remove(id) {
        const video = await this.videoModel.findById(id).exec();
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID "${id}" not found`);
        }
        await this.videoModel.findByIdAndDelete(id).exec();
        await this.auditLogsService.createLog({
            action: 'DELETE_VIDEO',
            module: 'Videos',
            user: 'Admin',
            details: `Deleted video: ${video.title}`,
        });
    }
    async updateStatus(id, status) {
        const video = await this.videoModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Videos',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} video: ${video.title}`,
        });
        return video;
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], VideosService);
//# sourceMappingURL=videos.service.js.map