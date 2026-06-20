"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
}

export default function MedicineReviews({
  medicineId,
}: {
  medicineId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!medicineId) return;
    try {
      const res = await axios.get(`/api/reviews/${medicineId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  }, [medicineId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleSubmitReview = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";
      await axios.post(
        `${baseUrl}/api/reviews`,
        { rating, comment, medicineId },
        { withCredentials: true },
      );
      alert("Review submitted successfully!");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch {
      alert("Failed to submit review. Make sure you ordered this item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-10 max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <form
        onSubmit={handleSubmitReview}
        className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-8 space-y-4"
      >
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Share your feedback ...
        </h3>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium">Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-5 w-5 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your experience with this medicine..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-emerald-500 bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-50 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-800 text-sm">
                  {rev.user?.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
