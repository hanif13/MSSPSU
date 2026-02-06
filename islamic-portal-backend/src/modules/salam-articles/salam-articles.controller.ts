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
import { SalamArticlesService } from './salam-articles.service';
import { CreateSalamArticleDto, UpdateSalamArticleDto } from './dto/salam-article.dto';

@ApiTags('Salam Articles')
@Controller('salam-articles')
export class SalamArticlesController {
    constructor(private readonly salamArticlesService: SalamArticlesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new salam article' })
    create(@Body() createDto: CreateSalamArticleDto) {
        return this.salamArticlesService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all salam articles' })
    @ApiQuery({ name: 'status', required: false })
    findAll(@Query('status') status?: string) {
        return this.salamArticlesService.findAll(status);
    }

    @Get('published')
    @ApiOperation({ summary: 'Get all published salam articles' })
    findPublished() {
        return this.salamArticlesService.findPublished();
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get salam article by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.salamArticlesService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get salam article by ID' })
    findOne(@Param('id') id: string) {
        return this.salamArticlesService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update salam article' })
    update(@Param('id') id: string, @Body() updateDto: UpdateSalamArticleDto) {
        return this.salamArticlesService.update(id, updateDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update salam article status' })
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.salamArticlesService.updateStatus(id, status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete salam article' })
    remove(@Param('id') id: string) {
        return this.salamArticlesService.remove(id);
    }
}
