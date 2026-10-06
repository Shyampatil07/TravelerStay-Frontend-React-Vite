import { useEffect, useState } from "react";
import api from "../services/api";

function ReviewSection({ propertyId }) {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchReviews();
    }, [propertyId]);


    const fetchReviews = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/properties/${propertyId}/reviews`
            );

            console.log(
                "REVIEWS:",
                response.data
            );

            setReviews(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "REVIEWS ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                "Unable to load reviews."
            );

        } finally {

            setLoading(false);
        }
    };


    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (sum, review) =>
                        sum + review.rating,
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";


    const renderStars = (rating) => {

        return (
            <span className="review-stars">

                {"★".repeat(rating)}

                <span className="empty-stars">
                    {"★".repeat(5 - rating)}
                </span>

            </span>
        );
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitMessage("");

        if (!comment.trim()) {
            setSubmitMessage(
                "Please write a comment."
            );
            return;
        }

        try {

            setSubmitting(true);

            const response = await api.post(
                `/properties/${propertyId}/reviews`,
                {
                    rating: Number(rating),
                    comment: comment.trim()
                }
            );

            console.log(
                "REVIEW CREATED:",
                response.data
            );

            const newReview =
                response.data.data;

            setReviews((previous) => [
                newReview,
                ...previous
            ]);

            setComment("");
            setRating(5);

            setSubmitMessage(
                "Review submitted successfully!"
            );

        } catch (error) {

            console.error(
                "REVIEW CREATE ERROR:",
                error.response?.data ||
                error.message
            );

            setSubmitMessage(
                error.response?.data?.message ||
                "Unable to submit review."
            );

        } finally {

            setSubmitting(false);
        }
    };


    return (
        <section className="reviews-section">

            {/* Header */}

            <div className="reviews-header">

                <div>

                    <h2>
                        ⭐ {averageRating} · Reviews
                    </h2>

                    <p>
                        {reviews.length}{" "}
                        {reviews.length === 1
                            ? "review"
                            : "reviews"}
                    </p>

                </div>

            </div>


            {/* Loading */}

            {loading && (
                <p className="reviews-message">
                    Loading reviews...
                </p>
            )}


            {/* Error */}

            {!loading && error && (
                <p className="reviews-error">
                    {error}
                </p>
            )}


            {/* Reviews */}

            {!loading &&
                !error &&
                reviews.length === 0 && (

                    <div className="no-reviews">

                        <h3>
                            No reviews yet
                        </h3>

                        <p>
                            Be the first guest to share
                            your experience.
                        </p>

                    </div>
                )}


            {!loading &&
                !error &&
                reviews.length > 0 && (

                    <div className="reviews-list">

                        {reviews.map((review) => (

                            <div
                                className="review-item"
                                key={review.id}
                            >

                                <div className="review-top">

                                    <div className="review-user">

                                        <div className="review-avatar">
                                            {review.userName
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <strong>
                                                {review.userName}
                                            </strong>

                                            <p>
                                                {new Date(
                                                    review.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    }
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    <div>
                                        {renderStars(
                                            review.rating
                                        )}
                                    </div>

                                </div>


                                <p className="review-comment">
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>
                )}


            {/* Write Review */}

            {token && (

                <div className="write-review">

                    <h3>
                        Write a review
                    </h3>

                    <p>
                        Share your experience with
                        other Wanderlust guests.
                    </p>


                    <form onSubmit={handleSubmit}>

                        <div className="rating-selector">

                            <label>
                                Rating
                            </label>

                            <div className="rating-buttons">

                                {[1, 2, 3, 4, 5].map(
                                    (value) => (

                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                value <= rating
                                                    ? "rating-star active"
                                                    : "rating-star"
                                            }
                                            onClick={() =>
                                                setRating(value)
                                            }
                                        >
                                            ★
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="review-form-group">

                            <label>
                                Comment
                            </label>

                            <textarea
                                value={comment}
                                onChange={(e) =>
                                    setComment(
                                        e.target.value
                                    )
                                }
                                placeholder="How was your stay?"
                                rows="5"
                                required
                            />

                        </div>


                        {submitMessage && (
                            <p className="review-submit-message">
                                {submitMessage}
                            </p>
                        )}


                        <button
                            type="submit"
                            className="submit-review-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>

                    </form>

                </div>
            )}

        </section>
    );
}

export default ReviewSection;
