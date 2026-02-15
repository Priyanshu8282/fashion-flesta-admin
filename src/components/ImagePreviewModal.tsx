'use client';

import React, { useEffect, useState } from 'react';

interface ImagePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    imageAlt: string;
}

export default function ImagePreviewModal({
    isOpen,
    onClose,
    imageUrl,
    imageAlt,
}: ImagePreviewModalProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoaded(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-300"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop with soft light tint and blur */}
            <div 
                className="fixed inset-0 bg-white/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Close Button - More professional Indigo/Primary styling */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-[110] p-2 bg-white shadow-xl border border-gray-100 rounded-full text-gray-500 hover:text-primary-600 transition-all hover:scale-110 active:scale-95 group"
                title="Close"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Content Container - Contained smaller "Small Model" style */}
            <div className="relative z-[105] w-full max-w-lg flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                <div className="relative group overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white p-3 border border-gray-50">
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-[2rem]">
                            <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                    <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        onLoad={() => setIsLoaded(true)}
                        className={`w-full h-auto max-h-[60vh] object-cover rounded-[2rem] transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/f8fafc/64748b?text=Image+Missing';
                        }}
                    />
                    
                    {/* Caption - Light styled */}
                    <div className="mt-4 pb-4 px-6 text-center">
                        <p className="text-gray-900 font-bold text-lg truncate">
                            {imageAlt}
                        </p>
                       
                    </div>
                </div>

                        
            </div>
        </div>
    );
}
