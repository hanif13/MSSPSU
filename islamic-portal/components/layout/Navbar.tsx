// ============================================
// components/layout/Navbar.tsx
// Navbar พร้อมปุ่มสนับสนุนการทำงานของชมรม
// ============================================

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen, Heart, Copy, Check } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const accountNumber = "1538507292";

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                Islamic Portal
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-700 font-medium transition"
              >
                หน้าแรก
              </Link>
              <Link
                href="/articles"
                className="text-gray-700 hover:text-primary-700 font-medium transition"
              >
                บทความ
              </Link>
              <Link
                href="/videos"
                className="text-gray-700 hover:text-primary-700 font-medium transition"
              >
                วิดีโอ
              </Link>
              <Link
                href="/annur-journal"
                className="text-gray-700 hover:text-primary-700 font-medium transition"
              >
                วารสารอันนูร
              </Link>
              <Link
                href="/salam-islam"
                className="text-gray-700 hover:text-primary-700 font-medium transition"
              >
                สวัสดีอิสลาม
              </Link>
            </div>

            {/* Donate Button - Desktop */}
            <div className="hidden md:block">
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2"
              >
                <Heart size={18} />
                สนับสนุนการทำงานของชมรม
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-700 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-primary-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary-700 font-medium"
              >
                หน้าแรก
              </Link>
              <Link
                href="/articles"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary-700 font-medium"
              >
                บทความ
              </Link>
              <Link
                href="/videos"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary-700 font-medium"
              >
                วิดีโอ
              </Link>
              <Link
                href="/annur-journal"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary-700 font-medium"
              >
                วารสารอันนูร
              </Link>
              <Link
                href="/salam-islam"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary-700 font-medium"
              >
                สวัสดีอิสลาม
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDonateModalOpen(true);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                สนับสนุนการทำงานของชมรม
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Donate Modal */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDonateModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsDonateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-primary-700 text-center mb-6">
              สนับสนุนการทำงานของชมรม
            </h2>

            {/* QR Code Image Container */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                {/* PromptPay Header */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">พร้อมเพย์</span>
                  <span className="font-bold text-primary-700">PromptPay</span>
                </div>

                {/* QR Code Placeholder - Replace with actual QR image */}
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <div className="w-48 h-48 bg-white border border-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      {/* This would be replaced with actual QR image */}
                      <svg viewBox="0 0 100 100" className="w-40 h-40">
                        <rect fill="#fff" width="100" height="100" />
                        {/* Simplified QR pattern */}
                        <g fill="#000">
                          <rect x="10" y="10" width="20" height="20" />
                          <rect x="70" y="10" width="20" height="20" />
                          <rect x="10" y="70" width="20" height="20" />
                          <rect x="35" y="35" width="30" height="30" />
                          <rect x="40" y="40" width="8" height="8" fill="#00b8d4" />
                          <rect x="52" y="40" width="8" height="8" fill="#00b8d4" />
                          <rect x="40" y="52" width="8" height="8" fill="#00b8d4" />
                          <rect x="52" y="52" width="8" height="8" fill="#00b8d4" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="text-center space-y-3">
              <p className="text-gray-600">
                ชื่อบัญชี: <span className="font-bold text-gray-800">นางสาวซอฟีเราะห์ ดอเลาะ</span>
              </p>

              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-600">เลขบัญชี:</span>
                <span className="font-bold text-xl text-primary-700">{accountNumber}</span>
                <button
                  onClick={handleCopyAccount}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                  title="คัดลอกเลขบัญชี"
                >
                  {isCopied ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>

              <p className="text-gray-700 font-medium">ธนาคารกสิกรไทย</p>

              <p className="text-sm text-primary-600 mt-4">
                * รองรับสแกนผ่านแอปธนาคารทุกประเภท
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}