export declare class CreateJournalDto {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    slug: string;
    date?: string;
    issue?: string;
    coverImage?: string;
    pdfUrl?: string;
    status?: string;
}
export declare class UpdateJournalDto {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    author?: string;
    slug?: string;
    date?: string;
    issue?: string;
    coverImage?: string;
    pdfUrl?: string;
    status?: string;
}
