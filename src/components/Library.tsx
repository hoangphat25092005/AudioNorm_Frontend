import React, { useState } from 'react';
import { PlayIcon, PauseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AudioFile {
    id: string;
    name: string;
    artist: string;
    genre: string;
    duration: string;
    db: number;
    file?: File;
}

const Library: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [masterDb, setMasterDb] = useState(20);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [playbackTime, setPlaybackTime] = useState<{ [key: string]: number }>({});
    const [hoveredFile, setHoveredFile] = useState<string | null>(null);

    // Mock data - replace with actual uploaded files
    const [audioFiles] = useState<AudioFile[]>([
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
    ]);

    const filteredFiles = audioFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePlay = (fileId: string) => {
        if (currentlyPlaying === fileId) {
            setCurrentlyPlaying(null);
        } else {
            setCurrentlyPlaying(fileId);
            // Reset playback time when starting a new track
            if (!playbackTime[fileId]) {
                setPlaybackTime(prev => ({ ...prev, [fileId]: 0 }));
            }
        }
    };

    const handleExport = (fileId: string) => {
        console.log(`Exporting file with ID: ${fileId}`);
        // Implement export logic here
    };

    const handleExportAll = () => {
        console.log('Exporting all files');
        // Implement export all logic here
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
        {/* Header Controls Bar - Same height as main header */}
        <div className="fixed top-20 left-52 right-0 h-20 bg-white dark:bg-dark-sidebar border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between z-40">
            <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-80 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                </div>

                {/* Sort Button */}
                <button
                    onClick={handleSort}
                    className="px-4 py-2 bg-black text-white border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                    Sort
                </button>
            </div>

            <div className="flex items-center gap-6">
                {/* Master Db Control */}
                <div className="flex items-center gap-3">
                    <span className="text-white font-medium">Master Db:</span>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={masterDb}
                        onChange={(e) => setMasterDb(Number(e.target.value))}
                        className="w-24 h-1 bg-black rounded-lg appearance-none cursor-pointer slider-black"
                        style={{
                            background: 'black',
                        }}
                    />
                    <span className="text-white w-6">{masterDb}</span>
                </div>

                {/* Export All Button */}
                <button
                    onClick={handleExportAll}
                    className="px-4 py-2 bg-black text-white border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                    Export all
                </button>
            </div>
        </div>

        {/* Audio Files List - Added small margin between header and songs */}
        <div className="pt-24 p-6 space-y-2">
            {filteredFiles.map((file, index) => {
                const isHovered = hoveredFile === file.id;
                
                return (
                    <div
                        key={file.id}
                        onMouseEnter={() => setHoveredFile(file.id)}
                        onMouseLeave={() => setHoveredFile(null)}
                        className="flex items-center justify-between p-4 bg-dark-sidebar border border-gray-600 dark:border-gray-700 rounded transition-colors hover:bg-gray-800"
                    >
                        {/* File Info */}
                        <div className="flex items-center gap-4 flex-1">
                            <span className={`w-4 transition-colors ${
                                isHovered ? 'text-primary' : 'text-gray-300 dark:text-gray-200'
                            }`}>
                                {index + 1}|
                            </span>
                            <div className="flex-1">
                                <span className={`transition-colors ${
                                    isHovered ? 'text-primary' : 'text-gray-200 dark:text-gray-100'
                                }`}>
                                    {file.name} | {file.artist} | {file.genre} | {file.duration}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {/* Db Display */}
                            <div className="flex flex-col items-center gap-1">
                                <span className={`text-xs transition-colors ${
                                    isHovered ? 'text-primary' : 'text-gray-300 dark:text-gray-200'
                                }`}>
                                    {file.db} Db
                                </span>
                                <div className="w-16 h-2 bg-black rounded">
                                    <div 
                                        className={`h-full rounded transition-colors ${
                                            isHovered ? 'bg-primary' : 'bg-gray-400'
                                        }`}
                                        style={{ width: `${(file.db / 40) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Preview Controls */}
                            <div className="flex items-center gap-2">
                                <span className={`text-sm transition-colors ${
                                    isHovered ? 'text-primary' : 'text-gray-300 dark:text-gray-200'
                                }`}>
                                    Preview
                                </span>
                                <button
                                    onClick={() => handlePlay(file.id)}
                                    className={`p-2 bg-transparent border-none transition-colors ${
                                        isHovered ? 'text-primary hover:text-primary' : 'text-gray-300 hover:text-gray-100'
                                    }`}
                                >
                                    {currentlyPlaying === file.id ? (
                                        <PauseIcon className="w-4 h-4" />
                                    ) : (
                                        <PlayIcon className="w-4 h-4" />
                                    )}
                                </button>
                                
                                {/* Progress Bar */}
                                <div className="w-24 h-1 bg-black rounded">
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
                                    isHovered ? 'text-primary' : 'text-gray-400'
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
            <div className="text-center py-12 pt-24">
                <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No files match your search.' : 'No audio files uploaded yet.'}
                </p>
            </div>
        )}
    </div>
);
}

export default Library;