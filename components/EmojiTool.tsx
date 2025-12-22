"use client";

import React, { useState, useEffect } from 'react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';

export const EmojiTool: React.FC = () => {
    const [selectedEmoji, setSelectedEmoji] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Detect dark mode from system or class (simplified for now, ideally use a context or observer)
    useEffect(() => {
        // Check if the html tag has 'dark' class
        const checkDark = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkDark();
        // Optional: Add observer for class changes if dynamic switching is common without reload
    }, []);

    const onEmojiClick = (emojiData: any) => {
        setSelectedEmoji(emojiData);
        navigator.clipboard.writeText(emojiData.emoji);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col xl:flex-row gap-8 items-start">

            {/* Left: Picker Area */}
            <div className="flex-1 w-full bg-white dark:bg-surface-dark rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-white/5 flex justify-center">
                <EmojiPicker
                    theme={isDark ? Theme.DARK : Theme.LIGHT}
                    emojiStyle={EmojiStyle.APPLE}
                    onEmojiClick={onEmojiClick}
                    width="100%"
                    height={500}
                    lazyLoadEmojis={true}
                    searchPlaceHolder="Search emoji..."
                />
            </div>

            {/* Right: Detail & Preview Area */}
            <div className="w-full xl:w-1/3 flex flex-col gap-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col items-center text-center">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-8">Selected Emoji</h3>

                    {selectedEmoji ? (
                        <>
                            <div className="text-[8rem] leading-none mb-6 drop-shadow-2xl transition-transform animate-in zoom-in-50 duration-300">
                                {selectedEmoji.emoji}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <h2 className="text-2xl font-black text-text-main dark:text-white capitalize">
                                    {selectedEmoji.names[0]}
                                </h2>
                                <p className="text-gray-500 text-sm font-mono truncate bg-gray-50 dark:bg-black/20 p-2 rounded-lg">
                                    {selectedEmoji.unified}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">touch_app</span>
                            <p>Select an emoji to view details</p>
                        </div>
                    )}
                </div>

                {/* Action Card */}
                {selectedEmoji && (
                    <div className={`bg-primary/10 border border-primary/20 rounded-3xl p-6 flex flex-col items-center text-center transition-all duration-300 ${copied ? 'scale-105' : ''}`}>
                        <div className="text-primary font-bold text-lg mb-1">
                            {copied ? 'Copied to Clipboard!' : 'Click to Copy'}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};
