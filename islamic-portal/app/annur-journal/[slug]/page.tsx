// ============================================
// app/annur-journal/[slug]/page.tsx
// หน้ารายละเอียดวารสาร - ดึงข้อมูลจาก API จริง
// ============================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Share2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Journal {
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
}

interface JournalPageProps {
    params: Promise<{ slug: string }>;
}

async function getJournal(slug: string): Promise<Journal | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/journals/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching journal:', error);
        return null;
    }
}

async function getOtherJournals(currentId: string): Promise<Journal[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/journals/published`, { cache: 'no-store' });
        if (!res.ok) return [];
        const journals = await res.json();
        return journals.filter((j: Journal) => j._id !== currentId).slice(0, 2);
    } catch (error) {
        return [];
    }
}

export default async function JournalDetailPage({ params }: JournalPageProps) {
    const { slug } = await params;
    const journal = await getJournal(slug);

    if (!journal) {
        notFound();
    }

    const otherJournals = await getOtherJournals(journal._id);

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/annur-journal"
                        className="inline-flex items-center gap-2 !text-white/80 hover:!text-white mb-6 transition"
                    >
                        <ArrowLeft size={20} />
                        กลับไปหน้าวารสาร
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-1 bg-white/20 rounded-full text-sm text-white">
                            {journal.category}
                        </span>
                        <span className="flex items-center gap-1 text-white/80 text-sm">
                            <Calendar size={16} />
                            {journal.date}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {journal.title}
                    </h1>

                    <p className="text-white/80 text-lg">
                        {journal.issue}
                    </p>
                </div>
            </div>

            {/* Cover Image */}
            {journal.coverImage && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={journal.coverImage}
                            alt={journal.title}
                            className="w-full aspect-square object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <div className="flex gap-3 mb-8">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                            <Share2 size={18} />
                            แชร์
                        </button>
                    </div>

                    <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600">
                        <div dangerouslySetInnerHTML={{ __html: formatContent(journal.content) }} />
                    </article>
                </div>

                {/* Other Journals */}
                {otherJournals.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">วารสารฉบับอื่น</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {otherJournals.map((other) => (
                                <Link key={other._id} href={`/annur-journal/${other.slug}`}>
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                                        {other.coverImage && (
                                            <img
                                                src={other.coverImage}
                                                alt={other.title}
                                                className="w-full aspect-square object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                                                <FileText size={14} />
                                                <span>{other.category}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{other.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">{other.excerpt}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatContent(content: string): string {
    return content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br />');
}
