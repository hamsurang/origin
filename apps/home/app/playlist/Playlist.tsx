'use client'

import { useMemo, useState } from 'react'
import { type Track, TRACKS } from './playlist.constants'

function Equalizer() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      <span className="w-[3px] bg-blue-500 rounded-sm animate-eq-1" />
      <span className="w-[3px] bg-blue-500 rounded-sm animate-eq-2" />
      <span className="w-[3px] bg-blue-500 rounded-sm animate-eq-3" />
    </div>
  )
}

function TrackItem({
  track,
  rank,
  isActive,
  isPlaying,
  onPlay,
  onPause,
}: {
  track: Track
  rank: number
  isActive: boolean
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}) {
  return (
    <div
      className={`grid grid-cols-[16px_44px_1fr] items-center gap-2 w-full px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-blue-50' : 'hover:bg-gray-100'
      }`}
    >
      {/* Rank / Equalizer */}
      <span className="flex items-center justify-center">
        {isPlaying ? (
          <Equalizer />
        ) : (
          <span className="text-xs text-gray-400 tabular-nums">{rank}</span>
        )}
      </span>

      {/* Thumbnail with pause overlay */}
      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        className="relative w-11 h-11 rounded overflow-hidden shrink-0 group"
      >
        <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
        {isPlaying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="white"
              role="img"
              aria-label="Pause"
            >
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          </div>
        )}
        {isActive && !isPlaying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="white"
              role="img"
              aria-label="Pause"
            >
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          </div>
        )}
      </button>

      {/* Content: 3 rows */}
      <button type="button" onClick={isPlaying ? onPause : onPlay} className="text-left min-w-0">
        <p
          className={`text-sm truncate leading-tight ${
            isActive ? 'text-blue-600 font-medium' : 'text-gray-900'
          }`}
        >
          {track.title}
        </p>
        <p className="text-xs text-gray-500 truncate leading-tight">{track.artist}</p>
        <p className="text-xs text-gray-400 truncate leading-tight">
          {track.recommendedBy}
          {track.reactions > 0 && <span> / 👍 {track.reactions}</span>}
        </p>
      </button>
    </div>
  )
}

function TopContributors({ tracks }: { tracks: Track[] }) {
  const top3 = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of tracks) {
      counts[t.recommendedBy] = (counts[t.recommendedBy] || 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [tracks])

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-2">Top Contributors</p>
      <div className="flex flex-col gap-1">
        {top3.map(([name, count], i) => (
          <div key={name} className="flex items-center gap-2 px-3 py-1">
            <span className="text-xs w-4">{['🥇', '🥈', '🥉'][i]}</span>
            <span className="text-sm text-gray-700 flex-1">{name}</span>
            <span className="text-xs text-gray-400 tabular-nums">
              {count} {count === 1 ? 'track' : 'tracks'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Playlist() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = (track: Track) => {
    if (currentTrack?.videoId === track.videoId && !isPlaying) {
      setIsPlaying(true)
    } else if (currentTrack?.videoId !== track.videoId) {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  return (
    <div className="sticky top-4">
      <style>{`
        @keyframes eq-1 {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
        @keyframes eq-2 {
          0%, 100% { height: 8px; }
          30% { height: 3px; }
          70% { height: 12px; }
        }
        @keyframes eq-3 {
          0%, 100% { height: 5px; }
          40% { height: 12px; }
          80% { height: 3px; }
        }
        .animate-eq-1 { animation: eq-1 0.8s ease-in-out infinite; }
        .animate-eq-2 { animation: eq-2 0.7s ease-in-out infinite; }
        .animate-eq-3 { animation: eq-3 0.9s ease-in-out infinite; }
      `}</style>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-900">Playlist</span>
        <span className="text-xs text-gray-500">{TRACKS.length} tracks</span>
      </div>

      <div className="flex flex-col gap-0.5">
        {TRACKS.map((track, i) => (
          <TrackItem
            key={track.videoId}
            track={track}
            rank={i + 1}
            isActive={currentTrack?.videoId === track.videoId}
            isPlaying={isPlaying && currentTrack?.videoId === track.videoId}
            onPlay={() => handlePlay(track)}
            onPause={handlePause}
          />
        ))}
      </div>

      {/* Now playing bar */}
      {currentTrack && (
        <div className="mt-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs text-gray-500">{isPlaying ? 'Now Playing' : 'Paused'}</p>
          <p className="text-sm text-gray-900 font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
        </div>
      )}

      <TopContributors tracks={TRACKS} />

      {/* Hidden YouTube iframe for audio playback */}
      {currentTrack && isPlaying && (
        <iframe
          key={currentTrack.videoId}
          src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1`}
          title={currentTrack.title}
          allow="autoplay; encrypted-media"
          className="absolute w-0 h-0 overflow-hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  )
}
