import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface FeedbackItem {
    id: string;
    username: string;
    rating: number;
    comment: string;
    date: string;
}

const Feedback: React.FC = () => {
    const [userComment, setUserComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);

    // Mock existing feedback data
    const [feedbackList] = useState<FeedbackItem[]>([
        {
            id: '1',
            username: 'Random user',
            rating: 5,
            comment: 'User review here for everyone to see',
            date: 'Sunday, 6th of June, 2025'
        }
    ]);

    const handleSubmit = () => {
        if (userComment.trim() && userRating > 0) {
            console.log('Feedback submitted:', {
                comment: userComment,
                rating: userRating,
                date: new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            });
            // Reset form
            setUserComment('');
            setUserRating(0);
        }
    };

    const renderStars = (rating: number, interactive: boolean = false) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starNumber = index + 1;
            const isFilled = interactive 
                ? starNumber <= (hoveredStar || userRating)
                : starNumber <= rating;

            return (
                <button
                    key={index}
                    type="button"
                    className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
                    onClick={interactive ? () => setUserRating(starNumber) : undefined}
                    onMouseEnter={interactive ? () => setHoveredStar(starNumber) : undefined}
                    onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
                    disabled={!interactive}
                >
                    {isFilled ? (
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <StarOutlineIcon className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    )}
                </button>
            );
        });
    };

    return (
        <div className="w-full h-full p-8">
            {/* User Input Section */}
            <div className="bg-dark-sidebar border border-gray-600 dark:border-gray-700 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-primary font-medium">Username</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-300 dark:text-gray-400">Rating</span>
                        <div className="flex gap-1">
                            {renderStars(userRating, true)}
                        </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                </div>
                
                <div className="mb-4">
                    <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="User comment"
                        className="w-full h-20 p-3 bg-transparent border border-gray-600 dark:border-gray-700 rounded text-gray-300 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                </div>
                
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!userComment.trim() || userRating === 0}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Upload
                    </button>
                </div>
            </div>

            {/* Existing Feedback Section */}
            <div className="space-y-4">
                {feedbackList.map((feedback) => (
                    <div
                        key={feedback.id}
                        className="bg-dark-sidebar border border-gray-600 dark:border-gray-700 rounded-lg p-6"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-4">
                                <span className="text-primary font-medium">{feedback.username}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-300 dark:text-gray-400">Rated</span>
                                <div className="flex gap-1">
                                    {renderStars(feedback.rating)}
                                </div>
                            </div>
                            <div className="text-gray-400 dark:text-gray-500 text-sm">
                                {feedback.date}
                            </div>
                        </div>
                        
                        <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
                            {feedback.comment}
                        </p>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {feedbackList.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-600">No feedback yet. Be the first to leave a review!</p>
                </div>
            )}
        </div>
    );
};

export default Feedback;