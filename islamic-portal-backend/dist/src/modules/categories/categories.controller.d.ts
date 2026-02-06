import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./category.schema").Category>;
    findAll(type?: string): Promise<any[]>;
    findOne(id: string): Promise<import("./category.schema").Category>;
    findBySlug(slug: string): Promise<import("./category.schema").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./category.schema").Category>;
    remove(id: string): Promise<void>;
}
