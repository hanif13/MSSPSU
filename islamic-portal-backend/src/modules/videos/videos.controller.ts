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
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new video' })
    create(@Body() createVideoDto: CreateVideoDto) {
        return this.videosService.create(createVideoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all videos' })
    @ApiQuery({ name: 'status', required: false })
    findAll(@Query('status') status?: string) {
        return this.videosService.findAll(status);
    }

    @Get('published')
    @ApiOperation({ summary: 'Get all published videos' })
    findPublished() {
        return this.videosService.findPublished();
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get video by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.videosService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get video by ID' })
    findOne(@Param('id') id: string) {
        return this.videosService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update video' })
    update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
        return this.videosService.update(id, updateVideoDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update video status' })
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.videosService.updateStatus(id, status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete video' })
    remove(@Param('id') id: string) {
        return this.videosService.remove(id);
    }
}
