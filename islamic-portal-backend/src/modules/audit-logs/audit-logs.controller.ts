import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Audit Logs')
@Controller('logs')
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all audit logs' })
    async getAllLogs() {
        return this.auditLogsService.findAll();
    }

    @Get('recent')
    @ApiOperation({ summary: 'Get recent audit logs' })
    async getRecentLogs(@Query('limit') limit: number = 10) {
        return this.auditLogsService.findRecent(limit);
    }
}
