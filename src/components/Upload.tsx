import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
    onFilesUploaded?: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (files.length > 0 && onFilesUploaded) {
            onFilesUploaded(files);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && onFilesUploaded) {
            onFilesUploaded(files);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 max-w-4xl mx-auto">
            {/* Main Upload Area */}
            <div
                className={`
                    w-full max-w-2xl h-96 border-2 border-dashed rounded-lg
                    flex flex-col items-center justify-center
                    transition-all duration-200 cursor-pointer
                    ${isDragOver 
                        ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileSelect}
            >
                {/* Upload Icon */}
                <div className="mb-6">
                    <CloudArrowUpIcon className="w-16 h-16 text-primary" />
                </div>

                {/* Upload Text */}
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                    Drop files or click choose files
                </h2>

                {/* Choose Files Button */}
                <button 
                    className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFileSelect();
                    }}
                >
                    Choose files
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
                        <span className="font-medium">- Step 2:</span> Go into library to view uploaded files and use preview to hear those before exporting.
                    </p>
                    <p>
                        <span className="font-medium">- Step 3:</span> Press export in library and you can download the files back to your PC.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;