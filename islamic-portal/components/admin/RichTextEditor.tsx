// ============================================
// components/admin/RichTextEditor.tsx
// Custom Rich Text Editor - ไม่ต้องใช้ API key
// ============================================

"use client";

import { useRef, useCallback, useEffect } from "react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    Undo,
    Redo,
    RemoveFormatting,
    Table,
    Code,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    height?: number;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "เริ่มเขียนเนื้อหา...",
    height = 400,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current && !isInitialized.current && value) {
            editorRef.current.innerHTML = value;
            isInitialized.current = true;
        }
    }, [value]);

    // Execute command
    const execCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleInput();
        editorRef.current?.focus();
    }, []);

    // Handle input change
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Insert link
    const insertLink = useCallback(() => {
        const url = prompt("กรอก URL:");
        if (url) {
            execCommand("createLink", url);
        }
    }, [execCommand]);

    // Insert image
    const insertImage = useCallback(() => {
        const url = prompt("กรอก URL รูปภาพ:");
        if (url) {
            execCommand("insertImage", url);
        }
    }, [execCommand]);

    // Insert table
    const insertTable = useCallback(() => {
        const rows = prompt("จำนวนแถว:", "3");
        const cols = prompt("จำนวนคอลัมน์:", "3");
        if (rows && cols) {
            let table = '<table class="editor-table"><thead><tr>';
            for (let c = 0; c < parseInt(cols); c++) {
                table += `<th>หัวข้อ ${c + 1}</th>`;
            }
            table += '</tr></thead><tbody>';
            for (let r = 0; r < parseInt(rows) - 1; r++) {
                table += '<tr>';
                for (let c = 0; c < parseInt(cols); c++) {
                    table += '<td>&nbsp;</td>';
                }
                table += '</tr>';
            }
            table += '</tbody></table><p></p>';
            execCommand("insertHTML", table);
        }
    }, [execCommand]);

    // Toolbar button component
    const ToolbarButton = ({
        icon,
        onClick,
        title,
        active = false,
    }: {
        icon: React.ReactNode;
        onClick: () => void;
        title: string;
        active?: boolean;
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded transition ${active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            title={title}
        >
            {icon}
        </button>
    );

    // Toolbar divider
    const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b border-gray-200">
                {/* Undo/Redo */}
                <ToolbarButton
                    icon={<Undo size={18} />}
                    onClick={() => execCommand("undo")}
                    title="ยกเลิก (Ctrl+Z)"
                />
                <ToolbarButton
                    icon={<Redo size={18} />}
                    onClick={() => execCommand("redo")}
                    title="ทำซ้ำ (Ctrl+Y)"
                />

                <Divider />

                {/* Headings */}
                <ToolbarButton
                    icon={<Heading1 size={18} />}
                    onClick={() => execCommand("formatBlock", "h1")}
                    title="หัวข้อ 1"
                />
                <ToolbarButton
                    icon={<Heading2 size={18} />}
                    onClick={() => execCommand("formatBlock", "h2")}
                    title="หัวข้อ 2"
                />
                <ToolbarButton
                    icon={<Heading3 size={18} />}
                    onClick={() => execCommand("formatBlock", "h3")}
                    title="หัวข้อ 3"
                />
                <ToolbarButton
                    icon={<Pilcrow size={18} />}
                    onClick={() => execCommand("formatBlock", "p")}
                    title="ย่อหน้า"
                />

                <Divider />

                {/* Text formatting */}
                <ToolbarButton
                    icon={<Bold size={18} />}
                    onClick={() => execCommand("bold")}
                    title="ตัวหนา (Ctrl+B)"
                />
                <ToolbarButton
                    icon={<Italic size={18} />}
                    onClick={() => execCommand("italic")}
                    title="ตัวเอียง (Ctrl+I)"
                />
                <ToolbarButton
                    icon={<Underline size={18} />}
                    onClick={() => execCommand("underline")}
                    title="ขีดเส้นใต้ (Ctrl+U)"
                />
                <ToolbarButton
                    icon={<Strikethrough size={18} />}
                    onClick={() => execCommand("strikeThrough")}
                    title="ขีดฆ่า"
                />

                <Divider />

                {/* Alignment */}
                <ToolbarButton
                    icon={<AlignLeft size={18} />}
                    onClick={() => execCommand("justifyLeft")}
                    title="ชิดซ้าย"
                />
                <ToolbarButton
                    icon={<AlignCenter size={18} />}
                    onClick={() => execCommand("justifyCenter")}
                    title="กึ่งกลาง"
                />
                <ToolbarButton
                    icon={<AlignRight size={18} />}
                    onClick={() => execCommand("justifyRight")}
                    title="ชิดขวา"
                />
                <ToolbarButton
                    icon={<AlignJustify size={18} />}
                    onClick={() => execCommand("justifyFull")}
                    title="เต็มความกว้าง"
                />

                <Divider />

                {/* Lists */}
                <ToolbarButton
                    icon={<List size={18} />}
                    onClick={() => execCommand("insertUnorderedList")}
                    title="รายการแบบจุด"
                />
                <ToolbarButton
                    icon={<ListOrdered size={18} />}
                    onClick={() => execCommand("insertOrderedList")}
                    title="รายการแบบตัวเลข"
                />
                <ToolbarButton
                    icon={<Quote size={18} />}
                    onClick={() => execCommand("formatBlock", "blockquote")}
                    title="คำพูด"
                />

                <Divider />

                {/* Insert */}
                <ToolbarButton
                    icon={<LinkIcon size={18} />}
                    onClick={insertLink}
                    title="แทรกลิงก์"
                />
                <ToolbarButton
                    icon={<Image size={18} />}
                    onClick={insertImage}
                    title="แทรกรูปภาพ"
                />
                <ToolbarButton
                    icon={<Table size={18} />}
                    onClick={insertTable}
                    title="แทรกตาราง"
                />
                <ToolbarButton
                    icon={<Code size={18} />}
                    onClick={() => execCommand("formatBlock", "pre")}
                    title="โค้ด"
                />

                <Divider />

                {/* Clear formatting */}
                <ToolbarButton
                    icon={<RemoveFormatting size={18} />}
                    onClick={() => execCommand("removeFormat")}
                    title="ลบรูปแบบ"
                />
            </div>

            {/* Editor Content Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="editor-content focus:outline-none"
                style={{ minHeight: height }}
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />

            {/* Word count */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                <span>
                    {editorRef.current?.innerText?.trim()?.split(/\s+/).filter(Boolean).length || 0} คำ
                </span>
                <span>กด Ctrl+B, Ctrl+I, Ctrl+U สำหรับจัดรูปแบบเร็ว</span>
            </div>

            {/* Editor Styles */}
            <style jsx global>{`
        .editor-content {
          padding: 1rem;
          font-family: 'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #1f2937;
        }

        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        .editor-content:focus {
          outline: none;
        }

        .editor-content h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.5em 0;
          color: #111827;
        }

        .editor-content h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0;
          color: #1f2937;
        }

        .editor-content h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.5em 0;
          color: #374151;
        }

        .editor-content p {
          margin: 0.75em 0;
        }

        .editor-content a {
          color: #2563eb;
          text-decoration: underline;
        }

        .editor-content a:hover {
          color: #1d4ed8;
        }

        .editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }

        .editor-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1em 0;
          color: #4b5563;
          font-style: italic;
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }

        .editor-content ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 0.75em 0;
        }

        .editor-content ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin: 0.75em 0;
        }

        .editor-content li {
          margin: 0.25em 0;
        }

        .editor-content pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Fira Code', monospace;
          font-size: 14px;
          margin: 1em 0;
        }

        .editor-content table,
        .editor-content .editor-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }

        .editor-content th,
        .editor-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }

        .editor-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }

        .editor-content tr:nth-child(even) td {
          background-color: #f9fafb;
        }
      `}</style>
        </div>
    );
}
