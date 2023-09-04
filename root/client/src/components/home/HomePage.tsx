import React, { useState, useEffect } from 'react';

const texts = [
    "AIPA: The Future of Procurement",
    "Streamline with Artificial Intelligence",
    "Dive into a new era of procurement. AIPA intelligently guides your company to make data-driven decisions with the power of AI."
];

type HomePageProps = {
    onLoginClick: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
    const [displayedTexts, setDisplayedTexts] = useState<string[]>(['', '', '']);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [typingCompleted, setTypingCompleted] = useState(false);

    useEffect(() => {
        // if all texts are displayed, set typingCompleted to true
        if (currentTextIndex >= texts.length) {
            setTypingCompleted(true);
            return;
        }

        const currentText = texts[currentTextIndex];
        if (currentCharIndex < currentText.length) {
            const randomDelay = Math.floor(Math.random() * (150 - 20 + 1)) + 20;

            const timer = setTimeout(() => {
                setDisplayedTexts(prev => {
                    const newDisplayedTexts = [...prev];
                    newDisplayedTexts[currentTextIndex] += currentText[currentCharIndex];
                    return newDisplayedTexts;
                });
                setCurrentCharIndex(prev => prev + 1);
            }, randomDelay);

            return () => clearTimeout(timer);
        } else {
            setCurrentTextIndex(prev => prev + 1);
            setCurrentCharIndex(0);
        }

    }, [currentTextIndex, currentCharIndex]);

    return (
        <div className="h-screen-78 flex flex-col justify-center items-center text-white transition-all duration-700 ease-in-out transform"
            style={{ transform: typingCompleted ? 'translateY(-20%)' : 'translateY(0)' }}>
            <div className="text-center px-4">

                <h1 className="text-primary-500 lg:text-5xl text-3xl mb-6 tracking-widest">
                    {displayedTexts[0]}
                </h1>

                <h2 className="text-primary-500 lg:text-2xl text-xl mb-4 tracking-wider">
                    {displayedTexts[1]}
                </h2>

                <p className="text-primary-500 lg:text-lg text-base tracking-wider mb-6">
                    {displayedTexts[2]}
                </p>

                {typingCompleted && (
                    <button
                        onClick={() => onLoginClick()}
                        className="text-primary-500 border lg:hover:bg-primary-500 lg:hover:text-white border-primary-500 rounded mt-4 py-2 px-6 transform transition-all duration-700 ease-in-out -translate-y-12 opacity-0"
                        style={{ opacity: typingCompleted ? '1' : '0', transform: typingCompleted ? 'translateY(0)' : '-translateY(12px)' }}
                    >
                        Login
                    </button>
                )}

            </div>
        </div>
    );
};

export default HomePage;
