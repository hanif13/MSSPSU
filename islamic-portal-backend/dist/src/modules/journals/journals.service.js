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
exports.JournalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const journal_schema_1 = require("./journal.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let JournalsService = class JournalsService {
    journalModel;
    auditLogsService;
    constructor(journalModel, auditLogsService) {
        this.journalModel = journalModel;
        this.auditLogsService = auditLogsService;
    }
    async create(createJournalDto) {
        if (!createJournalDto.date) {
            const now = new Date();
            createJournalDto.date = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        const journal = new this.journalModel(createJournalDto);
        const savedJournal = await journal.save();
        await this.auditLogsService.createLog({
            action: 'CREATE_JOURNAL',
            module: 'Journals',
            user: 'Admin',
            details: `Created journal: ${savedJournal.title}`,
        });
        return savedJournal;
    }
    async findAll(status) {
        const query = status ? { status } : {};
        return this.journalModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findPublished() {
        return this.journalModel.find({ status: 'published' }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const journal = await this.journalModel.findById(id).exec();
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with ID "${id}" not found`);
        }
        return journal;
    }
    async findBySlug(slug) {
        const journal = await this.journalModel
            .findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
            .exec();
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with slug "${slug}" not found`);
        }
        return journal;
    }
    async update(id, updateJournalDto) {
        const journal = await this.journalModel
            .findByIdAndUpdate(id, updateJournalDto, { new: true })
            .exec();
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: 'UPDATE_JOURNAL',
            module: 'Journals',
            user: 'Admin',
            details: `Updated journal: ${journal.title}`,
        });
        return journal;
    }
    async remove(id) {
        const journal = await this.journalModel.findById(id).exec();
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with ID "${id}" not found`);
        }
        await this.journalModel.findByIdAndDelete(id).exec();
        await this.auditLogsService.createLog({
            action: 'DELETE_JOURNAL',
            module: 'Journals',
            user: 'Admin',
            details: `Deleted journal: ${journal.title}`,
        });
    }
    async updateStatus(id, status) {
        const journal = await this.journalModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with ID "${id}" not found`);
        }
        await this.auditLogsService.createLog({
            action: status === 'published' ? 'APPROVE_CONTENT' : 'REJECT_CONTENT',
            module: 'Journals',
            user: 'Admin',
            details: `${status === 'published' ? 'Approved' : 'Rejected'} journal: ${journal.title}`,
        });
        return journal;
    }
};
exports.JournalsService = JournalsService;
exports.JournalsService = JournalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(journal_schema_1.Journal.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], JournalsService);
//# sourceMappingURL=journals.service.js.map