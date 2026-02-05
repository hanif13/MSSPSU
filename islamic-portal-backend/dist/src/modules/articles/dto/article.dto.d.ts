export declare class CreateArticleDto {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorTitle?: string;
    slug: string;
    publishedAt?: string;
    readTime?: string;
    coverImage?: string;
    status?: string;
}
export declare class UpdateArticleDto {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    author?: string;
    authorTitle?: string;
    slug?: string;
    publishedAt?: string;
    readTime?: string;
    views?: number;
    coverImage?: string;
    status?: string;
}
