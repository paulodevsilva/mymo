"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MusicSegmentSelectorProps {
  videoId: string;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  initialStart?: number;
  initialEnd?: number;
}

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicSegmentSelector({
  videoId,
  onStartTimeChange,
  onEndTimeChange,
  initialStart = 0,
  initialEnd = 30,
}: MusicSegmentSelectorProps) {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
  }, [videoId]);

  const initializePlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId: videoId,
      playerVars: {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1, // Important for iOS
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = (event: any) => {
    setIsReady(true);
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);

    // Set initial end time to 30 seconds or video duration, whichever is smaller
    const initialEndTime = Math.min(30, videoDuration);
    setEndTime(initialEndTime);
    onEndTimeChange(initialEndTime);
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setShowPlayPrompt(false);
    } else {
      setIsPlaying(false);
    }
  };

  // Update current time while playing
  useEffect(() => {
    if (!isPlaying || !playerRef.current) return;

    const interval = setInterval(() => {
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);

      // Stop at end time
      if (time >= endTime) {
        playerRef.current.pauseVideo();
        playerRef.current.seekTo(startTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, endTime, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const tryPlayVideo = async () => {
    if (!playerRef.current) return false;

    try {
      await playerRef.current.playVideo();
      setUserInteracted(true);
      setShowPlayPrompt(false);
      return true;
    } catch (error) {
      console.log("Autoplay blocked, user interaction required");
      setShowPlayPrompt(true);
      return false;
    }
  };

  const handlePlayPause = async () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.seekTo(startTime);
      const success = await tryPlayVideo();
      if (!success) {
        setShowPlayPrompt(true);
      }
    }
  };

  const handleStartChange = async (value: number) => {
    const newStart = Math.min(value, endTime - 5); // Minimum 5 second segment
    setStartTime(newStart);
    onStartTimeChange(newStart);

    if (isDraggingStart && playerRef.current) {
      playerRef.current.seekTo(newStart);

      // Only try to play if user has interacted before
      if (userInteracted) {
        if (!isPlaying) {
          await tryPlayVideo();
        }
      } else {
        setShowPlayPrompt(true);
      }
    }
  };

  const handleEndChange = async (value: number) => {
    const newEnd = Math.max(value, startTime + 5); // Minimum 5 second segment
    setEndTime(newEnd);
    onEndTimeChange(newEnd);

    if (isDraggingEnd && playerRef.current) {
      const previewTime = Math.max(startTime, newEnd - 3);
      playerRef.current.seekTo(previewTime);

      // Only try to play if user has interacted before
      if (userInteracted) {
        if (!isPlaying) {
          await tryPlayVideo();
        }
      } else {
        setShowPlayPrompt(true);
      }
    }
  };

  const handleStartDragStart = () => {
    setIsDraggingStart(true);
  };

  const handleStartDragEnd = () => {
    setIsDraggingStart(false);
    if (playerRef.current && isPlaying) {
      playerRef.current.pauseVideo();
    }
  };

  const handleEndDragStart = () => {
    setIsDraggingEnd(true);
  };

  const handleEndDragEnd = () => {
    setIsDraggingEnd(false);
    if (playerRef.current && isPlaying) {
      playerRef.current.pauseVideo();
    }
  };

  const segmentDuration = endTime - startTime;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-3">
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="hidden" />

      {/* Safari Mobile Autoplay Prompt */}
      {showPlayPrompt && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 animate-pulse">
          <div className="text-amber-600 shrink-0 mt-0.5">
            <Play size={16} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">
              Toque para ouvir
            </p>
            <p className="text-[9px] text-amber-700 mt-0.5">
              Clique no botão play ou arraste os controles para ouvir o preview
            </p>
          </div>
        </div>
      )}

      {/* Header - More Compact */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            Selecione o Trecho
          </p>
          <p className="text-[9px] text-stone-400 mt-0.5">
            Duração: {formatTime(segmentDuration)}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={!isReady}
          className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shrink-0"
        >
          {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
        </button>
      </div>

      {/* Visual Progress Bar - Smaller on Mobile */}
      <div className="relative h-12 md:h-16 bg-stone-200 rounded-lg overflow-hidden">
        {/* Selected Segment Highlight */}
        <div
          className="absolute top-0 bottom-0 bg-rose-200 transition-all"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />

        {/* Current Playback Position */}
        {isPlaying && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-600 transition-all"
            style={{ left: `${progressPercent}%` }}
          />
        )}

        {/* Waveform Effect (decorative) - Fewer bars on mobile */}
        <div className="absolute inset-0 flex items-center justify-around px-1 opacity-30">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-stone-400 rounded-full hidden md:block"
              style={{
                height: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <div
              key={`mobile-${i}`}
              className="w-0.5 bg-stone-400 rounded-full md:hidden"
              style={{
                height: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Time Range Sliders - Compact Layout */}
      <div className="space-y-2">
        {/* Start Time Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">
              Início
            </label>
            <span className="text-xs font-mono text-rose-600 font-bold">
              {formatTime(startTime)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={1}
            value={startTime}
            onChange={(e) => handleStartChange(Number(e.target.value))}
            onMouseDown={handleStartDragStart}
            onMouseUp={handleStartDragEnd}
            onTouchStart={handleStartDragStart}
            onTouchEnd={handleStartDragEnd}
            disabled={!isReady}
            className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-rose-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:shadow-lg"
          />
        </div>

        {/* End Time Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">
              Fim
            </label>
            <span className="text-xs font-mono text-rose-600 font-bold">
              {formatTime(endTime)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={1}
            value={endTime}
            onChange={(e) => handleEndChange(Number(e.target.value))}
            onMouseDown={handleEndDragStart}
            onMouseUp={handleEndDragEnd}
            onTouchStart={handleEndDragStart}
            onTouchEnd={handleEndDragEnd}
            disabled={!isReady}
            className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-rose-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:shadow-lg"
          />
        </div>
      </div>

      {/* Helper Text - Smaller and Hidden on Very Small Screens */}
      <p className="text-[8px] text-stone-400 text-center hidden sm:block">
        Arraste os controles para selecionar o trecho. O áudio tocará automaticamente.
      </p>
    </div>
  );
}
