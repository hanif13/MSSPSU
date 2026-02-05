// ============================================
// lib/api.ts
// API Client for connecting to NestJS Backend
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Generic fetch wrapper
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
}

// ============================================
// Article API
// ============================================
export interface Article {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorTitle?: string;
    slug: string;
    publishedAt?: string;
    readTime?: string;
    views: number;
    coverImage?: string;
    status: 'draft' | 'pending' | 'published' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export const articlesApi = {
    getAll: (status?: string) =>
        fetchApi<Article[]>(`/articles${status ? `?status=${status}` : ''}`),

    getPublished: () =>
        fetchApi<Article[]>('/articles/published'),

    getById: (id: string) =>
        fetchApi<Article>(`/articles/${id}`),

    getBySlug: (slug: string) =>
        fetchApi<Article>(`/articles/slug/${slug}`),

    create: (data: Partial<Article>) =>
        fetchApi<Article>('/articles', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<Article>) =>
        fetchApi<Article>(`/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateStatus: (id: string, status: string) =>
        fetchApi<Article>(`/articles/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/articles/${id}`, { method: 'DELETE' }),
};

// ============================================
// Video API
// ============================================
export interface Video {
    _id: string;
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
    status: 'draft' | 'pending' | 'published' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export const videosApi = {
    getAll: (status?: string) =>
        fetchApi<Video[]>(`/videos${status ? `?status=${status}` : ''}`),

    getPublished: () =>
        fetchApi<Video[]>('/videos/published'),

    getById: (id: string) =>
        fetchApi<Video>(`/videos/${id}`),

    getBySlug: (slug: string) =>
        fetchApi<Video>(`/videos/slug/${slug}`),

    create: (data: Partial<Video>) =>
        fetchApi<Video>('/videos', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<Video>) =>
        fetchApi<Video>(`/videos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateStatus: (id: string, status: string) =>
        fetchApi<Video>(`/videos/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/videos/${id}`, { method: 'DELETE' }),
};

// ============================================
// Journal API
// ============================================
export interface Journal {
    _id: string;
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
    status: 'draft' | 'pending' | 'published' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export const journalsApi = {
    getAll: (status?: string) =>
        fetchApi<Journal[]>(`/journals${status ? `?status=${status}` : ''}`),

    getPublished: () =>
        fetchApi<Journal[]>('/journals/published'),

    getById: (id: string) =>
        fetchApi<Journal>(`/journals/${id}`),

    getBySlug: (slug: string) =>
        fetchApi<Journal>(`/journals/slug/${slug}`),

    create: (data: Partial<Journal>) =>
        fetchApi<Journal>('/journals', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<Journal>) =>
        fetchApi<Journal>(`/journals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateStatus: (id: string, status: string) =>
        fetchApi<Journal>(`/journals/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/journals/${id}`, { method: 'DELETE' }),
};

// ============================================
// Salam Article API
// ============================================
export interface SalamArticle {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    slug: string;
    icon?: string;
    publishedAt?: string;
    coverImage?: string;
    status: 'draft' | 'pending' | 'published' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export const salamArticlesApi = {
    getAll: (status?: string) =>
        fetchApi<SalamArticle[]>(`/salam-articles${status ? `?status=${status}` : ''}`),

    getPublished: () =>
        fetchApi<SalamArticle[]>('/salam-articles/published'),

    getById: (id: string) =>
        fetchApi<SalamArticle>(`/salam-articles/${id}`),

    getBySlug: (slug: string) =>
        fetchApi<SalamArticle>(`/salam-articles/slug/${slug}`),

    create: (data: Partial<SalamArticle>) =>
        fetchApi<SalamArticle>('/salam-articles', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<SalamArticle>) =>
        fetchApi<SalamArticle>(`/salam-articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateStatus: (id: string, status: string) =>
        fetchApi<SalamArticle>(`/salam-articles/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/salam-articles/${id}`, { method: 'DELETE' }),
};

// ============================================
// User API
// ============================================
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'user';
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export const usersApi = {
    login: (email: string, password: string) =>
        fetchApi<LoginResponse>('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (data: { name: string; email: string; password: string }) =>
        fetchApi<User>('/users/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAll: () =>
        fetchApi<User[]>('/users'),

    getById: (id: string) =>
        fetchApi<User>(`/users/${id}`),

    update: (id: string, data: Partial<User>) =>
        fetchApi<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/users/${id}`, { method: 'DELETE' }),
};

// ============================================
// Category API
// ============================================
export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    type: 'article' | 'video' | 'journal' | 'salam';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const categoriesApi = {
    getAll: (type?: string) =>
        fetchApi<Category[]>(`/categories${type ? `?type=${type}` : ''}`),

    getById: (id: string) =>
        fetchApi<Category>(`/categories/${id}`),

    getBySlug: (slug: string) =>
        fetchApi<Category>(`/categories/slug/${slug}`),

    create: (data: Partial<Category>) =>
        fetchApi<Category>('/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<Category>) =>
        fetchApi<Category>(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/categories/${id}`, { method: 'DELETE' }),
};
