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
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new article' })
    create(@Body() createArticleDto: CreateArticleDto) {
        return this.articlesService.create(createArticleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all articles' })
    @ApiQuery({ name: 'status', required: false, enum: ['draft', 'pending', 'published', 'rejected'] })
    findAll(@Query('status') status?: string) {
        return this.articlesService.findAll(status);
    }

    @Get('published')
    @ApiOperation({ summary: 'Get all published articles' })
    findPublished() {
        return this.articlesService.findPublished();
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get article by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.articlesService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get article by ID' })
    findOne(@Param('id') id: string) {
        return this.articlesService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update article' })
    update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articlesService.update(id, updateArticleDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update article status' })
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.articlesService.updateStatus(id, status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete article' })
    remove(@Param('id') id: string) {
        return this.articlesService.remove(id);
    }
}
