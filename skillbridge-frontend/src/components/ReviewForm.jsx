import React, { useState } from 'react';
import API from '../api/axios';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from "@/lib/utils";

const ReviewForm = ({ projectId, onReviewSubmitted, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return alert("Please select a star rating");
        try {
            await API.post(`/reviews/${projectId}`, { rating, comment });
            alert("Review submitted!");
            onReviewSubmitted();
        } catch (err) {
            alert("Error: " + (err.response?.data || "Could not save review"));
        }
    };

    return (
        <div className="flex flex-col gap-6 text-left p-2">
            <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Rate your experience</h4>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-all duration-200",
                                    (hover || rating) >= star 
                                        ? "fill-amber-400 text-amber-400" 
                                        : "text-zinc-200 dark:text-zinc-700"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <label className="text-base font-bold text-zinc-900 dark:text-white">Message</label>
                    <textarea
                        placeholder="Tell us about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white outline-none min-h-[120px] resize-none shadow-sm"
                    />
                </div>

                <div className="flex gap-3">
                    <Button 
                        type="submit" 
                        className="flex-1 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                        Submit Feedback
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel || (() => window.location.reload())}
                        className="flex-1 h-12 rounded-2xl border-zinc-200 dark:border-zinc-800 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
