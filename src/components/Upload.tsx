import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { uploadFiles } from '../services/api';

interface FileUploadProps {
    onFilesUploaded?: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
    // Your existing state
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Add these states
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [lastResults, setLastResults] = useState<any>(null);

    // Handle file upload
    const handleFileUpload = async (files: FileList) => {
        if (files.length === 0) return;
        
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);
        setLastResults(null);
        
        try {
            const fileArray = Array.from(files);
            const result = await uploadFiles(fileArray);
            
            setLastResults(result);
            setUploadSuccess(true);
            if (onFilesUploaded) onFilesUploaded(files);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center h-full p-8 max-w-4xl mx-auto">
            {/* Status Messages */}
            {uploadError && (
                <div className="w-full max-w-2xl mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {uploadError}
                </div>
            )}
            
            {uploadSuccess && (
                <div className="w-full max-w-2xl mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    Files uploaded successfully!
                    {lastResults && lastResults.results && (
                        <div className="mt-2 text-sm">
                            <strong>Uploaded Files:</strong>
                            {lastResults.results.map((result: any, index: number) => (
                                <div key={index} className="mt-1">
                                    {result.filename || result.original_filename}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main Upload Area */}
            <div
                className={`
                    w-full max-w-2xl h-96 border-2 border-dashed rounded-lg
                    flex flex-col items-center justify-center
                    transition-all duration-200 cursor-pointer
                    ${uploading 
                        ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        : isDragOver 
                            ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                `}
                onDragOver={uploading ? undefined : handleDragOver}
                onDragLeave={uploading ? undefined : handleDragLeave}
                onDrop={uploading ? undefined : handleDrop}
                onClick={uploading ? undefined : handleFileSelect}
            >
                {/* Upload Icon */}
                <div className="mb-6">
                    <CloudArrowUpIcon className="w-16 h-16 text-primary" />
                </div>

                {/* Upload Text */}
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                    {uploading ? 'Uploading files...' : 'Drop files or click choose files'}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    Upload audio files to your library
                </p>

                {/* Choose Files Button */}
                <button 
                    disabled={uploading}
                    className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFileSelect();
                    }}
                >
                    {uploading ? 'Uploading...' : 'Choose files'}
                </button>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* User Guide */}
            <div className="mt-12 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    User guide:
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                        <span className="font-medium">- Step 1:</span> Drag files with audio into this window or choose files on your PC to upload here.
                    </p>
                    <p>
                        <span className="font-medium">- Step 2:</span> Go to the Library to view your uploaded files.
                    </p>
                    <p>
                        <span className="font-medium">- Step 3:</span> In the Library, you can normalize audio files to different LUFS levels.
                    </p>
                    <p>
                        <span className="font-medium">- Step 4:</span> Use preview to hear the normalized audio before exporting.
                    </p>
                    <p>
                        <span className="font-medium">- Step 5:</span> Press export to download the files back to your PC.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;