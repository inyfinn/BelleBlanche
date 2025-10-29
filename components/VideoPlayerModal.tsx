import React from 'react';
import { useAppContext } from '../context/AppContext';
import { XMarkIcon } from './Icons';

const VideoPlayerModal: React.FC = () => {
    const { videoModalUrl, closeVideoPlayer } = useAppContext();

    if (!videoModalUrl) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={closeVideoPlayer}
        >
            <div 
                className="relative bg-black rounded-lg shadow-xl w-full max-w-3xl aspect-video"
                onClick={(e) => e.stopPropagation()}
            >
                <video
                    src={videoModalUrl}
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                >
                    Twoja przeglądarka nie obsługuje tagu wideo.
                </video>
                <button
                    onClick={closeVideoPlayer}
                    className="absolute -top-4 -right-4 bg-white text-dark rounded-full p-2 hover:scale-110 transition-transform"
                    aria-label="Zamknij odtwarzacz wideo"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default VideoPlayerModal;