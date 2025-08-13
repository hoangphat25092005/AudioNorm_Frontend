import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getUserFiles, getFileUrl, exportFile, exportAllFiles, AudioFile as ApiAudioFile } from '../services/api';

interface AudioFile {
    id: string;
    name: string;
    artist?: string;
    genre?: string;
    duration?: string;
    db?: number;
    file_url?: string;
}

const Library: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [masterDb, setMasterDb] = useState(20);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [playbackTime, setPlaybackTime] = useState<{ [key: string]: number }>({});
    const [hoveredFile, setHoveredFile] = useState<string | null>(null);
    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Mock data - replace with actual uploaded files
    /*const [audioFiles] = useState<AudioFile[]>([
        {
            id: '1',
            name: 'Nang kieu lo buoc',
            artist: 'HKT',
            genre: 'POP',
            duration: '3m42s',
            db: 20
        },
        {
            id: '2',
            name: 'Dung lam trai tim anh dau',
            artist: 'Son Tung MTP',
            genre: 'POP',
            duration: '3m42s',
            db: 20
        },
        {
            id: '3',
            name: 'Pha le tim',
            artist: 'Cao Thai Son',
            genre: 'POP',
            duration: '3m42s',
            db: 20
        },
        {
            id: '4',
            name: 'Noi vong tay lon',
            artist: 'Trinh Cong Son',
            genre: 'Acoustic',
            duration: '3m42s',
            db: 20
        }
    ]); */
    // Audio element ref for playback
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    
    // Fetch user files on component mount
    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const files = await getUserFiles();
                setAudioFiles(files);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load files');
            } finally {
                setLoading(false);
            }
        };
        
        fetchFiles();
    }, []);

    const filteredFiles = audioFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.artist && file.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (file.genre && file.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handlePlay = (fileId: string) => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        
        if (currentlyPlaying === fileId) {
            // Pause current playback
            audioRef.current.pause();
            setCurrentlyPlaying(null);
        } else {
            // Start new playback
            if (currentlyPlaying) {
                audioRef.current.pause();
            }
            
            audioRef.current.src = getFileUrl(fileId);
            audioRef.current.play().catch(err => console.error('Playback error:', err));
            setCurrentlyPlaying(fileId);
            
            // Track playback time
            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    setPlaybackTime(prev => ({
                        ...prev,
                        [fileId]: Math.floor(audioRef.current!.currentTime)
                    }));
                }
            };
            
            // Handle playback end
            audioRef.current.onended = () => {
                setCurrentlyPlaying(null);
            };
        }
    };

    const handleExport = async (fileId: string) => {
        try {
            const blob = await exportFile(fileId);
            const file = audioFiles.find(f => f.id === fileId);
            const fileName = file?.name || `export-${fileId}.mp3`;
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };
    

     const handleExportAll = async () => {
        try {
            const blob = await exportAllFiles();
            
            // Create download link for zip file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'all-audio-files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export all failed:', err);
        }
    };

    const handleSort = () => {
        console.log('Sorting files');
        // Implement sorting logic here
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

return (
    <div className="w-full h-full bg-gray-50 dark:bg-dark-bg">
        {/* Error Display */}
        {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 mb-4">
                {error}
            </div>
        )}

        {/* Loading Display */}
        {loading && (
            <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 mb-4">
                Loading audio files...
            </div>
        )}

        {/* Header Controls Bar - Now scrollable with content */}
        <div className="bg-white dark:bg-dark-sidebar border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-80 bg-white border-primary dark:bg-black border dark:border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                </div>

                {/* Sort Button */}
                <button
                    onClick={handleSort}
                    className="px-4 py-2 bg-white border-primary dark:bg-black dark:text-white border dark:border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                    Sort
                </button>
            </div>

            <div className="flex items-center gap-6">
                {/* Master Db Control */}
                <div className="flex items-center gap-3">
                    <span className="dark:text-white font-medium">Master Db:</span>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={masterDb}
                        onChange={(e) => setMasterDb(Number(e.target.value))}
                        className="w-24 h-1 dark:bg-black bg-primary rounded-lg border border-primary appearance-none cursor-pointer slider-black"
                        style={{
                            background: 'black',
                        }}
                    />
                    <span className="dark:text-white w-6">{masterDb}</span>
                </div>

                {/* Export All Button */}
                <button
                    onClick={handleExportAll}
                    className="px-4 py-2 bg-white text-primary border-primary dark:bg-black dark:text-white border dark:border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                    Export all
                </button>
            </div>
        </div>

        {/* Audio Files List - Removed excessive padding */}
        <div className="p-6 space-y-2">
            {filteredFiles.map((file, index) => {
                const isHovered = hoveredFile === file.id;
                
                return (
                    <div
                        key={file.id}
                        onMouseEnter={() => setHoveredFile(file.id)}
                        onMouseLeave={() => setHoveredFile(null)}
                        className="flex items-center justify-between p-4 bg-white dark:bg-dark-sidebar border border-primary dark:border-gray-700 rounded transition-colors hover:bg-gray-700 dark:hover:bg-gray-800"
                    >
                        {/* File Info */}
                        <div className="flex items-center gap-4 flex-1">
                            <span className={`w-4 transition-colors ${
                                isHovered ? 'text-primary' : 'text-black dark:text-gray-200'
                            }`}>
                                {index + 1}|
                            </span>
                            <div className="flex-1">
                                <span className={`transition-colors ${
                                    isHovered ? 'text-primary' : 'text-black dark:text-gray-100'
                                }`}>
                                    {file.name} | {file.artist || 'Unknown'} | {file.genre || 'Unknown'} | {file.duration || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {/* Db Display */}
                            <div className="flex flex-col items-center gap-1">
                                <span className={`text-xs transition-colors ${
                                    isHovered ? 'text-primary' : 'text-black dark:text-gray-200'
                                }`}>
                                    {file.db || 0} Db
                                </span>
                                <div className="w-16 h-2 bg-black border  rounded">
                                    <div 
                                        className={`h-full rounded transition-colors ${
                                            isHovered ? 'bg-primary' : 'bg-gray-400'
                                        }`}
                                        style={{ width: `${((file.db || 0) / 40) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Preview Controls */}
                            <div className="flex items-center gap-2">
                                <span className={`text-sm transition-colors ${
                                    isHovered ? 'text-primary' : 'text-black dark:text-gray-200'
                                }`}>
                                    Preview
                                </span>
                                <button
                                    onClick={() => handlePlay(file.id)}
                                    className={`p-2 bg-transparent border-none transition-colors ${
                                        isHovered ? 'text-primary hover:text-primary' : 'text-black hover:text-gray-100'
                                    }`}
                                >
                                    {currentlyPlaying === file.id ? (
                                        <PauseIcon className="w-4 h-4" />
                                    ) : (
                                        <PlayIcon className="w-4 h-4" />
                                    )}
                                </button>
                                
                                {/* Progress Bar */}
                                <div className="w-24 h-1 bg-black border border-primary rounded">
                                    <div 
                                        className={`h-full rounded transition-colors ${
                                            isHovered ? 'bg-primary' : 'bg-gray-400'
                                        }`}
                                        style={{ 
                                            width: currentlyPlaying === file.id ? '30%' : '0%' 
                                        }}
                                    />
                                </div>
                                
                                <span className={`text-xs w-8 transition-colors ${
                                    isHovered ? 'text-primary' : 'text-black'
                                }`}>
                                    {formatTime(playbackTime[file.id] || 0)}
                                </span>
                            </div>

                            {/* Export Button */}
                            <button
                                onClick={() => handleExport(file.id)}
                                className={`px-3 py-1 border rounded text-sm transition-colors ${
                                    isHovered 
                                        ? 'bg-primary border-primary text-white hover:bg-primary-hover' 
                                        : 'bg-black text-gray-200 border-gray-600 hover:bg-gray-800'
                                }`}
                            >
                                Export
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No files match your search.' : 'No audio files uploaded yet.'}
                </p>
            </div>
        )}
    </div>
);
}

export default Library;