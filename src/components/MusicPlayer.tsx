import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function MusicPlayer() {
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Attempt autoplay (browsers might block it until interaction)
        if (audioRef.current) {
            audioRef.current.volume = 0.15; // Volumen bajito
            audioRef.current.play().catch(e => {
                console.log("Autoplay bloqueado por el navegador, esperando interaccion.");
            });
        }
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            // If it was paused due to autoplay block, start it
            if (audioRef.current.paused) {
                audioRef.current.play().catch(() => { });
            }
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <audio
                ref={audioRef}
                src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
                loop
                autoPlay
            />
            <button
                onClick={toggleMute}
                className="bg-white/80 backdrop-blur-md hover:bg-white text-indigo-600 p-3 rounded-full shadow-lg border border-white/50 transition-all hover:scale-110"
                title={isMuted ? "Activar música" : "Silenciar música"}
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>
    );
}
