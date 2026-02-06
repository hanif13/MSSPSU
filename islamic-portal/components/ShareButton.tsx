'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
    url?: string;
    title?: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;
        const shareTitle = title || document.title;

        try {
            // Try Web Share API first (mobile)
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    url: shareUrl,
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            // If share is cancelled or fails, try clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (clipboardError) {
                console.error('Failed to copy:', clipboardError);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition relative"
        >
            {copied ? (
                <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-green-600">คัดลอกแล้ว!</span>
                </>
            ) : (
                <>
                    <Share2 size={18} />
                    แชร์
                </>
            )}
        </button>
    );
}
