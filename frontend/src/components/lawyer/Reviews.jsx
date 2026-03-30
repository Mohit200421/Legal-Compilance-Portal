// src/components/lawyer/Reviews.jsx
import { Star, ThumbsUp, MessageCircle, Calendar, User, ChevronRight, Filter, SortDesc, Award, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const Reviews = ({ rating, reviews = [] }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState(0);

  const average = rating?.average || 0;
  const count = rating?.count || reviews.length || 0;

  // Sample reviews data (replace with actual data from props)
  const sampleReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      author: "John Smith",
      avatar: null,
      rating: 5,
      date: "2024-02-15",
      comment: "Excellent lawyer! Very professional and knowledgeable. Won my case with great strategy.",
      helpful: 12,
      response: "Thank you for your kind words, John. It was a pleasure working with you."
    },
    {
      id: 2,
      author: "Sarah Johnson",
      avatar: null,
      rating: 4,
      date: "2024-02-10",
      comment: "Very helpful and responsive. Explained everything clearly and made the process easy.",
      helpful: 8,
      response: null
    },
    {
      id: 3,
      author: "Michael Brown",
      avatar: null,
      rating: 5,
      date: "2024-02-05",
      comment: "Highly recommend! Great communication and excellent results.",
      helpful: 15,
      response: "Thank you, Michael! I appreciate your trust."
    }
  ];

  // Filter and sort reviews
  const filteredReviews = sampleReviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else if (sortBy === "lowest") {
        return a.rating - b.rating;
      } else if (sortBy === "helpful") {
        return b.helpful - a.helpful;
      }
      return 0;
    });

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  // Rating distribution
  const ratingDistribution = {
    5: sampleReviews.filter(r => r.rating === 5).length,
    4: sampleReviews.filter(r => r.rating === 4).length,
    3: sampleReviews.filter(r => r.rating === 3).length,
    2: sampleReviews.filter(r => r.rating === 2).length,
    1: sampleReviews.filter(r => r.rating === 1).length,
  };

  const getRatingPercentage = (stars) => {
    return sampleReviews.length > 0 
      ? (ratingDistribution[stars] / sampleReviews.length) * 100 
      : 0;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-yellow-100 rounded-xl">
            <Star className="h-5 w-5 text-yellow-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Client Reviews</h2>
        </div>
        
        {count > 0 && (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Award className="h-3 w-3 mr-1" />
            {count} {count === 1 ? 'Review' : 'Reviews'}
          </span>
        )}
      </div>

      {/* Rating Summary Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 md:p-6 border border-yellow-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Overall Rating */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <span className="text-4xl md:text-5xl font-bold text-yellow-600">
                {average.toFixed(1)}
              </span>
              <p className="text-xs text-gray-500 mt-1">out of 5</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 md:h-6 md:w-6 ${
                      star <= Math.round(average)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {count} review{count !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Rating Distribution - Desktop */}
          <div className="hidden md:block w-64">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-2 text-sm mb-1">
                <span className="text-gray-600 w-8">{stars} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${getRatingPercentage(stars)}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 w-8 text-xs">
                  {ratingDistribution[stars]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution - Mobile */}
        <div className="md:hidden mt-4 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600 w-8">{stars} ★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${getRatingPercentage(stars)}%` }}
                ></div>
              </div>
              <span className="text-gray-500 text-xs w-8">
                {ratingDistribution[stars]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {count === 0 ? (
        /* Empty State */
        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-gray-500 italic mb-2">
            No reviews yet
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Be the first to share your experience with this lawyer
          </p>
          <button className="inline-flex items-center px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl text-sm font-medium transition-all shadow-md">
            <Star className="h-4 w-4 mr-2" />
            Write a Review
          </button>
        </div>
      ) : (
        <>
          {/* Filters and Sort - Mobile */}
          <div className="md:hidden flex space-x-2 mb-4 overflow-x-auto pb-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 ★</option>
              <option value={4}>4 ★</option>
              <option value={3}>3 ★</option>
              <option value={2}>2 ★</option>
              <option value={1}>1 ★</option>
            </select>
          </div>

          {/* Filters and Sort - Desktop */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter:
              </span>
              {[0, 5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterRating === rating
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {rating === 0 ? "All" : `${rating} ★`}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <SortDesc className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 mb-6">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-xl p-4 md:p-5 hover:border-yellow-300 hover:shadow-md transition-all"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.author}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-yellow-600 transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Helpful ({review.helpful})</span>
                  </button>

                  {review.response && (
                    <span className="text-xs text-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Lawyer responded
                    </span>
                  )}
                </div>

                {/* Lawyer Response */}
                {review.response && (
                  <div className="mt-3 pl-4 border-l-2 border-yellow-300 bg-yellow-50/30 p-3 rounded-lg">
                    <p className="text-xs font-medium text-yellow-800 mb-1">Response from lawyer:</p>
                    <p className="text-xs text-gray-600">{review.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {filteredReviews.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="inline-flex items-center px-6 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-sm font-medium transition-all border border-yellow-200 hover:border-yellow-300"
              >
                {showAllReviews ? (
                  <>
                    Show Less
                    <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
                  </>
                ) : (
                  <>
                    View All {filteredReviews.length} Reviews
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Write Review Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-xl text-sm font-medium transition-all shadow-md">
              <Star className="h-4 w-4 mr-2" />
              Write a Review
            </button>
          </div>
        </>
      )}

      {/* Stats Row - Mobile */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 md:hidden">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Reviews</p>
          <p className="text-base font-bold text-yellow-600">{count}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Average</p>
          <p className="text-base font-bold text-gray-900">{average.toFixed(1)}/5</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">5-Star</p>
          <p className="text-base font-bold text-green-600">{ratingDistribution[5]}</p>
        </div>
      </div>
    </div>
  );
};

export default Reviews;