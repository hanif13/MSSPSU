export declare class CreateVideoDto {
    title: string;
    excerpt: string;
    description: string;
    category: string;
    author: string;
    authorTitle?: string;
    slug: string;
    duration?: string;
    views?: string;
    publishedAt?: string;
    youtubeUrl?: string;
    coverImage?: string;
    status?: string;
}
export declare class UpdateVideoDto {
    title?: string;
    excerpt?: string;
    description?: string;
    category?: string;
    author?: string;
    authorTitle?: string;
    slug?: string;
    duration?: string;
    views?: string;
    publishedAt?: string;
    youtubeUrl?: string;
    coverImage?: string;
    status?: string;
}
