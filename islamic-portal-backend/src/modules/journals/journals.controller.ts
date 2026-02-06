import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JournalsService } from './journals.service';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';

@ApiTags('Journals')
@Controller('journals')
export class JournalsController {
    constructor(private readonly journalsService: JournalsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new journal' })
    create(@Body() createJournalDto: CreateJournalDto) {
        return this.journalsService.create(createJournalDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all journals' })
    @ApiQuery({ name: 'status', required: false })
    findAll(@Query('status') status?: string) {
        return this.journalsService.findAll(status);
    }

    @Get('published')
    @ApiOperation({ summary: 'Get all published journals' })
    findPublished() {
        return this.journalsService.findPublished();
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get journal by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.journalsService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get journal by ID' })
    findOne(@Param('id') id: string) {
        return this.journalsService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update journal' })
    update(@Param('id') id: string, @Body() updateJournalDto: UpdateJournalDto) {
        return this.journalsService.update(id, updateJournalDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update journal status' })
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.journalsService.updateStatus(id, status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete journal' })
    remove(@Param('id') id: string) {
        return this.journalsService.remove(id);
    }
}
