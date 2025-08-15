import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, MagnifyingGlassIcon, InformationCircleIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { getFileUrl, exportFile, getAudioStatus, getUploadedFiles, normalizeUploadedFile, getNormalizedFiles } from '../services/api';

interface AudioFile {
    id: string;
    name: string;
    artist?: string;
    genre?: string;
    duration?: string;
    db?: number;
    file_url?: string;
    original_filename?: string;
    normalized_filename?: string;
    target_lufs?: number;
    final_lufs?: number;
    original_lufs?: number;
    normalization_method?: string;
    created_at?: string;
    status?: string; // For uploaded files: 'uploaded', 'normalized'
    gridfs_id?: string;
    original_upload_id?: string; // Reference to original upload
    is_stored?: boolean;
    ready_to_download?: boolean;
    user_id?: string; // For user ownership
    user_name?: string; // For displaying owner name
    file_type?: 'original' | 'normalized';
}

type TabType = 'original' | 'normalized';

const Library: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('original');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [playbackTime, setPlaybackTime] = useState<{ [key: string]: number }>({});
    const [hoveredFile, setHoveredFile] = useState<string | null>(null);
    const [originalFiles, setOriginalFiles] = useState<AudioFile[]>([]);
    const [normalizedFiles, setNormalizedFiles] = useState<AudioFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [audioStatus, setAudioStatus] = useState<any>(null);
    const [normalizing, setNormalizing] = useState<{ [key: string]: boolean }>({});
    const [exporting, setExporting] = useState<{ [key: string]: boolean }>({});
    const [normalizationTarget, setNormalizationTarget] = useState<{ [key: string]: number }>({});
    const [successNotification, setSuccessNotification] = useState<string | null>(null);
    
    // Audio element ref for playback
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    
    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch both original and normalized files
                const [uploadedFiles, normalizedFiles, status] = await Promise.all([
                    getUploadedFiles().catch(() => []),
                    getNormalizedFiles().catch(() => []), // New API call for normalized files
                    getAudioStatus().catch(() => null)
                ]);
                
                setOriginalFiles(uploadedFiles);
                setNormalizedFiles(normalizedFiles);
                setAudioStatus(status);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load files');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Get current files based on active tab
    const currentFiles = activeTab === 'original' ? originalFiles : normalizedFiles;
    
    const filteredFiles = currentFiles.filter(file =>
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
            
            // Use different URL for uploaded vs normalized files
            const file = currentFiles.find(f => f.id === fileId);
            if (file) {
                audioRef.current.src = file.file_url || getFileUrl(fileId);
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
        }
    };

    const handleNormalize = async (fileId: string) => {
        const targetLufs = normalizationTarget[fileId] || -23.0;
        
        setNormalizing(prev => ({ ...prev, [fileId]: true }));
        try {
            const result = await normalizeUploadedFile(fileId, targetLufs);
            console.log('Normalization result:', result);
            
            // Show success notification
            const fileName = originalFiles.find(f => f.id === fileId)?.name || 'File';
            setSuccessNotification(`"${fileName}" has been normalized and is ready to download!`);
            setTimeout(() => setSuccessNotification(null), 5000); // Hide after 5 seconds
            
            // Refresh both files lists since normalization creates a new normalized file
            const [refreshedOriginal, refreshedNormalized] = await Promise.all([
                getUploadedFiles().catch(() => []),
                getNormalizedFiles().catch(() => [])
            ]);
            setOriginalFiles(refreshedOriginal);
            setNormalizedFiles(refreshedNormalized);
            
            // Clear error and switch to normalized tab to show the result
            setError(null);
            setActiveTab('normalized');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Normalization failed');
        } finally {
            setNormalizing(prev => ({ ...prev, [fileId]: false }));
        }
    };

    const handleExport = async (fileId: string) => {
        setExporting(prev => ({ ...prev, [fileId]: true }));
        try {
            const blob = await exportFile(fileId);
            const file = currentFiles.find(f => f.id === fileId);
            
            // Get the base filename without extension
            let baseName = file?.name || `export-${fileId}`;
            const lastDotIndex = baseName.lastIndexOf('.');
            const extension = lastDotIndex > 0 ? baseName.substring(lastDotIndex) : '.mp3';
            baseName = lastDotIndex > 0 ? baseName.substring(0, lastDotIndex) : baseName;
            
            // Add target LUFS to filename for normalized files
            let fileName = baseName;
            if (activeTab === 'normalized' && file?.target_lufs) {
                fileName = `${baseName} (${file.target_lufs} LUFS)${extension}`;
            } else {
                fileName = `${baseName}${extension}`;
            }
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Export failed:', err);
            setError(err instanceof Error ? err.message : 'Export failed');
        } finally {
            setExporting(prev => ({ ...prev, [fileId]: false }));
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
            <style>{`
                /* Custom slider styling */
                .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider-thumb::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider-thumb:disabled::-webkit-slider-thumb {
                    background: #9ca3af;
                    cursor: not-allowed;
                }
                
                .slider-thumb:disabled::-moz-range-thumb {
                    background: #9ca3af;
                    cursor: not-allowed;
                }
            `}</style>
            
            {/* Audio Status Info */}
            {audioStatus && (
                <div className="bg-blue-50 dark:bg-blue-900 border-b border-blue-200 dark:border-blue-700 px-6 py-2">
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        Audio Service: {audioStatus.status === 'working' ? '✅ Active' : '❌ Inactive'}
                        {audioStatus.message && ` - ${audioStatus.message}`}
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 mb-4">
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="ml-4 text-red-800 hover:text-red-900"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Loading Display */}
            {loading && (
                <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 mb-4">
                    Loading audio files...
                </div>
            )}

            {/* Success Notification */}
            {successNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {successNotification}
                    <button 
                        onClick={() => setSuccessNotification(null)}
                        className="ml-4 text-white hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-dark-sidebar border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MusicalNoteIcon className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Audio Library
                        </h1>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="mt-4 flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('original')}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'original'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Original Files
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                            {originalFiles.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('normalized')}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'normalized'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Normalized Files
                        <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            {normalizedFiles.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Header Controls Bar */}
            <div className="bg-white dark:bg-dark-sidebar border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab} files...`}
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

                {/* Tab-specific info */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activeTab === 'original' ? (
                        <span>Upload files to normalize them</span>
                    ) : (
                        <span>Normalized files stored in database</span>
                    )}
                </div>
            </div>

            {/* Audio Files List */}
            <div className="p-6 space-y-2">
                {filteredFiles.map((file, index) => {
                    const isHovered = hoveredFile === file.id;
                    const isNormalizing = normalizing[file.id];
                    const isNormalized = activeTab === 'normalized';
                    
                    return (
                        <React.Fragment key={file.id}>
                            <div
                                onMouseEnter={() => setHoveredFile(file.id)}
                                onMouseLeave={() => setHoveredFile(null)}
                                className="flex items-center justify-between p-4 bg-white dark:bg-dark-sidebar border border-primary dark:border-gray-700 rounded transition-colors hover:bg-gray-300 dark:hover:bg-gray-800"
                            >
                                {/* File Info - Enhanced */}
                                <div className="flex items-center gap-4 flex-1">
                                    <span className={`w-4 transition-colors ${
                                        isHovered ? 'text-primary' : 'text-black dark:text-gray-200'
                                    }`}>
                                        {index + 1}|
                                    </span>
                                    <div className="flex-1">
                                        <div className={`transition-colors ${
                                            isHovered ? 'text-primary' : 'text-black dark:text-gray-100'
                                        }`}>
                                            <span className="font-medium">{file.name}</span>
                                            {file.original_filename && file.original_filename !== file.name && (
                                                <span className="text-sm text-gray-500"> (from {file.original_filename})</span>
                                            )}
                                            <span className={`ml-2 px-2 py-1 text-xs rounded ${
                                                isNormalized
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {isNormalized ? 'Normalized' : 'Original'}
                                            </span>
                                            {/* User ownership indicator - show username instead of ID */}
                                            {file.user_name && (
                                                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                    Owner: {file.user_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {file.artist || 'Unknown'} | {file.genre || 'Unknown'} | {file.duration || 'Unknown'}
                                            {isNormalized && file.target_lufs && file.final_lufs && (
                                                <span> | Target: {file.target_lufs} LUFS → Final: {file.final_lufs.toFixed(1)} LUFS</span>
                                            )}
                                        </div>
                                        {isNormalized && file.normalization_method && (
                                            <div className="text-xs text-gray-400">
                                                Method: {file.normalization_method}
                                            </div>
                                        )}
                                        {isNormalized && file.original_upload_id && (
                                            <div className="text-xs text-gray-400">
                                                Source: {originalFiles.find(f => f.id === file.original_upload_id)?.name || 'Unknown'}
                                            </div>
                                        )}
                                    </div>
                                    {/* Details Toggle */}
                                    <button
                                        onClick={() => setShowDetails(showDetails === file.id ? null : file.id)}
                                        className={`p-1 transition-colors ${
                                            isHovered ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                        title="Show details"
                                    >
                                        <InformationCircleIcon className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4">
                                    {/* LUFS Display or Normalization Control */}
                                    <div className="flex flex-col items-center gap-2 min-w-[140px]">
                                        {isNormalized ? (
                                            // Show LUFS info for normalized files
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-xs text-green-600 dark:text-green-400 text-center font-medium">
                                                    Normalized
                                                </span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                    Target: {file.target_lufs || 'N/A'} LUFS
                                                </span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                    Final: {file.final_lufs?.toFixed(1) || 'N/A'} LUFS
                                                </span>
                                            </div>
                                        ) : (
                                            // Show normalization controls for original files
                                            <div className="flex flex-col items-center gap-1 w-full">
                                                <span className="text-xs text-black dark:text-gray-400 text-center">
                                                    Target: {normalizationTarget[file.id] || -23} LUFS
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 text-center w-full h-4 flex items-center justify-center">
                                                    {(() => {
                                                        const target = normalizationTarget[file.id] || -23;
                                                        if (target >= -12) return "Loud (Streaming)";
                                                        if (target >= -16) return "Standard (Spotify)";
                                                        if (target >= -20) return "Moderate";
                                                        return "Broadcast (TV/Radio)";
                                                    })()}
                                                </span>
                                                <input
                                                    type="range"
                                                    min="-30"
                                                    max="-6"
                                                    step="0.5"
                                                    value={normalizationTarget[file.id] || -23}
                                                    onChange={(e) => setNormalizationTarget(prev => ({
                                                        ...prev,
                                                        [file.id]: Number(e.target.value)
                                                    }))}
                                                    disabled={isNormalizing}
                                                    className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                                    style={{
                                                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((Math.abs(normalizationTarget[file.id] || -23) - 6) / (30 - 6)) * 100}%, #e5e7eb ${((Math.abs(normalizationTarget[file.id] || -23) - 6) / (30 - 6)) * 100}%, #e5e7eb 100%)`
                                                    }}
                                                />
                                                <div className="flex justify-between w-20 text-xs text-gray-400">
                                                    <span>-30</span>
                                                    <span>-6</span>
                                                </div>
                                                {/* Quick preset buttons */}
                                                <div className="flex gap-1 mt-1 justify-center w-full">
                                                    {[
                                                        { value: -14, label: "-14", title: "Spotify/Apple Music" },
                                                        { value: -16, label: "-16", title: "YouTube Music" },
                                                        { value: -23, label: "-23", title: "Broadcast/TV" }
                                                    ].map(preset => (
                                                        <button
                                                            key={preset.value}
                                                            onClick={() => setNormalizationTarget(prev => ({
                                                                ...prev,
                                                                [file.id]: preset.value
                                                            }))}
                                                            disabled={isNormalizing}
                                                            title={preset.title}
                                                            className={`px-2 py-0.5 text-xs rounded transition-colors w-8 flex items-center justify-center ${
                                                                (normalizationTarget[file.id] || -23) === preset.value
                                                                    ? 'bg-primary text-white'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            } ${isNormalizing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {preset.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => handleNormalize(file.id)}
                                                    disabled={isNormalizing}
                                                    className={`px-2 py-1 text-xs rounded transition-colors mt-1 ${
                                                        isNormalizing
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : isHovered
                                                                ? 'bg-primary text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {isNormalizing ? 'Normalizing...' : 'Normalize'}
                                                </button>
                                            </div>
                                        )}
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

                                    {/* Export Button - Show only for normalized files */}
                                    {isNormalized && (
                                        <button
                                            onClick={() => handleExport(file.id)}
                                            disabled={exporting[file.id]}
                                            className={`px-3 py-1 border rounded text-sm transition-colors ${
                                                exporting[file.id]
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                                                    : isHovered 
                                                        ? 'bg-primary border-primary text-white hover:bg-primary-hover' 
                                                        : 'bg-black text-gray-200 border-gray-600 hover:bg-gray-800'
                                            }`}
                                        >
                                            {exporting[file.id] 
                                                ? 'Exporting...' 
                                                : 'Export'
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Expandable Details Section */}
                            {showDetails === file.id && (
                                <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        {file.original_lufs !== undefined && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Original LUFS:</span>
                                                <div className="text-gray-900 dark:text-gray-100">{file.original_lufs.toFixed(1)}</div>
                                            </div>
                                        )}
                                        {file.target_lufs && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Target LUFS:</span>
                                                <div className="text-gray-900 dark:text-gray-100">{file.target_lufs}</div>
                                            </div>
                                        )}
                                        {file.final_lufs !== undefined && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Final LUFS:</span>
                                                <div className="text-gray-900 dark:text-gray-100">{file.final_lufs.toFixed(1)}</div>
                                            </div>
                                        )}
                                        {file.created_at && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                                    {isNormalized ? 'Normalized:' : 'Uploaded:'}
                                                </span>
                                                <div className="text-gray-900 dark:text-gray-100">
                                                    {new Date(file.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                        {file.gridfs_id && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Storage ID:</span>
                                                <div className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                                                    {file.gridfs_id.substring(0, 12)}...
                                                </div>
                                            </div>
                                        )}
                                        {file.user_name && (
                                            <div>
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Owner:</span>
                                                <div className="text-gray-900 dark:text-gray-100">
                                                    {file.user_name}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

                {/* Empty State */}
                {filteredFiles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm 
                                ? `No ${activeTab} files match your search.`
                                : activeTab === 'original'
                                    ? 'No uploaded files found. Go to Upload to add audio files.'
                                    : 'No normalized files found. Normalize some original files to see them here.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;