import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { submitFeedback, getAllFeedback, respondToFeedback, getFeedbackWithResponses, FeedbackResponse, FeedbackResponseItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
interface FeedbackItem {
    id: string;
    username: string;
    rating: number;
    comment: string;
    date: string;
}

const Feedback: React.FC = () => {
    const { user } = useAuth();
    const [userComment, setUserComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [feedbackList, setFeedbackList] = useState<FeedbackResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingFeedback, setFetchingFeedback] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Response handling state
    const [expandedFeedback, setExpandedFeedback] = useState<Set<string>>(new Set());
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    // Mock existing feedback data
    /* const [feedbackList] = useState<FeedbackItem[]>([
        {
            id: '1',
            username: 'Random user',
            rating: 5,
            comment: 'User review here for everyone to see',
            date: 'Sunday, 6th of June, 2025'
        }
    ]); */
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                console.log('Fetching feedback...');
                setFetchingFeedback(true);
                const data = await getAllFeedback();
                console.log('Feedback data received:', data);
                setFeedbackList(data);
            } catch (err) {
                console.error('Failed to fetch feedback:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
            } finally {
                setFetchingFeedback(false);
            }
        };
        
        fetchFeedback();
    }, []);
    const handleSubmit = async () => {
        if (userComment.trim() && userRating > 0) {
            setLoading(true);
            setError(null);
            
            try {
                await submitFeedback({
                    feedback_text: userComment,
                    rating: userRating
                });
                
                // Refresh feedback list
                const updatedFeedback = await getAllFeedback();
                setFeedbackList(updatedFeedback);
                
                // Reset form
                setUserComment('');
                setUserRating(0);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to submit feedback');
            } finally {
                setLoading(false);
            }
        }
    };

    // Response handling functions
    const toggleResponses = async (feedbackId: string) => {
        const newExpanded = new Set(expandedFeedback);
        
        if (expandedFeedback.has(feedbackId)) {
            newExpanded.delete(feedbackId);
        } else {
            newExpanded.add(feedbackId);
            // Fetch detailed feedback with responses if not already loaded
            try {
                const detailedFeedback = await getFeedbackWithResponses(feedbackId);
                setFeedbackList(prev => prev.map(item => 
                    item.id === feedbackId ? detailedFeedback : item
                ));
            } catch (err) {
                console.error('Failed to fetch feedback responses:', err);
            }
        }
        
        setExpandedFeedback(newExpanded);
    };

    const startReply = (feedbackId: string) => {
        setReplyingTo(feedbackId);
        setReplyText('');
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const submitReply = async (feedbackId: string) => {
        if (!replyText.trim()) return;
        
        setSubmittingReply(true);
        try {
            await respondToFeedback({
                response_text: replyText,
                feedback_id: feedbackId
            });
            
            // Refresh the specific feedback to show the new response
            const updatedFeedback = await getFeedbackWithResponses(feedbackId);
            setFeedbackList(prev => prev.map(item => 
                item.id === feedbackId ? updatedFeedback : item
            ));
            
            // Reset reply state
            setReplyingTo(null);
            setReplyText('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit reply');
        } finally {
            setSubmittingReply(false);
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
        <div className="w-full min-h-screen bg-gray-50 dark:bg-dark-bg p-8">
            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* User Input Section */}
            <div className="dark:bg-dark-sidebar border bg-white text-primary border-primary dark:border-gray-700 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-primary font-medium">{user?.username || 'Anonymous'}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-primary dark:text-gray-400">Rating</span>
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
                        className="text-primary border-primary w-full h-20 p-3 bg-transparent border  dark:border-gray-700 rounded  dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                </div>
                
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!userComment.trim() || userRating === 0 || loading}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-300 transition-colors"
                    >
                        {loading ? 'Submitting...' : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Existing Feedback Section */}
            {fetchingFeedback ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-600">Loading feedback...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {feedbackList.map((feedback) => (
                    <div
                        key={feedback.id}
                        className="bg-white dark:bg-dark-sidebar border border-primary dark:border-gray-700 rounded-lg p-6"
                    >
                        {/* Main Feedback */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-4">
                                <span className="text-primary font-medium">{feedback.user_name || 'Anonymous'}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-primary dark:text-gray-400">Rated</span>
                                <div className="flex gap-1">
                                    {renderStars(feedback.rating || 0)}
                                </div>
                            </div>
                            <div className="text-gray-400 dark:text-gray-500 text-sm">
                                {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                        
                        <p className="text-primary dark:text-gray-400 leading-relaxed mb-4">
                            {feedback.feedback_text}
                        </p>

                        {/* Response Controls */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* Show/Hide Responses */}
                            {feedback.response_count > 0 && (
                                <button
                                    onClick={() => toggleResponses(feedback.id)}
                                    className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
                                >
                                    {expandedFeedback.has(feedback.id) ? (
                                        <>
                                            <ChevronUpIcon className="w-4 h-4" />
                                            Hide {feedback.response_count} {feedback.response_count === 1 ? 'response' : 'responses'}
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDownIcon className="w-4 h-4" />
                                            Show {feedback.response_count} {feedback.response_count === 1 ? 'response' : 'responses'}
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Reply Button */}
                            <button
                                onClick={() => startReply(feedback.id)}
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                            >
                                <ChatBubbleLeftIcon className="w-4 h-4" />
                                Reply
                            </button>
                        </div>

                        {/* Responses */}
                        {expandedFeedback.has(feedback.id) && feedback.responses && (
                            <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4 space-y-3">
                                {feedback.responses.map((response: FeedbackResponseItem) => (
                                    <div key={response.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium text-primary">
                                                {response.user_name || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(response.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {response.response_text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === feedback.id && (
                            <div className="mt-4 ml-4 border-l-2 border-primary pl-4">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm font-medium text-primary">
                                            {user?.username || 'You'}
                                        </span>
                                        <span className="text-xs text-gray-500">replying...</span>
                                    </div>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your reply..."
                                        className="w-full h-20 p-3 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    />
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button
                                            onClick={cancelReply}
                                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => submitReply(feedback.id)}
                                            disabled={!replyText.trim() || submittingReply}
                                            className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {submittingReply ? 'Submitting...' : 'Submit Reply'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Empty State */}
                {feedbackList.length === 0 && !fetchingFeedback && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-600">No feedback yet. Be the first to leave a review!</p>
                    </div>
                )}
            </div>
            )}
        </div>
    );
};

export default Feedback;