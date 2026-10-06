import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";
import "./PropertyDetails.css";

function PropertyDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    // =========================================
    // PROPERTY
    // =========================================

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // BOOKING
    // =========================================

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);

    
// Multiple image gallery
const [activeImage, setActiveImage] = useState(0);
const [showFullDescription, setShowFullDescription] = useState(false);

    // =========================================
    // REVIEWS
    // =========================================

    const [reviews, setReviews] = useState([]);

    const [reviewSummary, setReviewSummary] = useState({
        averageRating: 0,
        reviewCount: 0
    });

    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [reviewsError, setReviewsError] = useState("");

    // =========================================
    // REVIEW FORM
    // =========================================

    const [reviewRating, setReviewRating] = useState(0);

    const [reviewComment, setReviewComment] = useState("");

    const [reviewSubmitting, setReviewSubmitting] =
        useState(false);

    const [reviewMessage, setReviewMessage] =
        useState("");

    const [reviewError, setReviewError] =
        useState("");

    // =========================================
    // AUTH
    // =========================================

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    // =========================================
    // PROPERTY
    // =========================================

    useEffect(() => {

        if (!id || id === "undefined") {

            setError("Property ID is missing.");
            setLoading(false);

            return;
        }

        fetchProperty();

    }, [id]);

    const fetchProperty = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/properties/${id}`
            );

            setProperty(response.data.data);

        } catch (error) {

            console.error(
                "PROPERTY DETAILS ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load property."
            );

        } finally {

            setLoading(false);

        }
    };

    // =========================================
    // REVIEWS
    // =========================================

    useEffect(() => {

        if (!id || id === "undefined") {
            return;
        }

        fetchReviews();

    }, [id]);

    const fetchReviews = async () => {

        try {

            setReviewsLoading(true);
            setReviewsError("");

            // Get reviews first
            const reviewsResponse = await api.get(
                `/properties/${id}/reviews`
            );

            setReviews(
                reviewsResponse.data?.data || []
            );

            // Summary is optional.
            // If summary endpoint is not available,
            // calculate it from reviews.
            try {

                const summaryResponse =
                    await api.get(
                        `/properties/${id}/reviews/summary`
                    );

                if (summaryResponse.data?.success) {

                    setReviewSummary(
                        summaryResponse.data.data
                    );

                }

            } catch (summaryError) {

                console.warn(
                    "Review summary endpoint unavailable. Calculating locally."
                );

                const reviewList =
                    reviewsResponse.data?.data || [];

                const count =
                    reviewList.length;

                const average =
                    count > 0
                        ? reviewList.reduce(
                              (sum, review) =>
                                  sum +
                                  Number(
                                      review.rating
                                  ),
                              0
                          ) / count
                        : 0;

                setReviewSummary({
                    averageRating:
                        Math.round(
                            average * 10
                        ) / 10,

                    reviewCount: count
                });
            }

        } catch (error) {

            console.error(
                "REVIEWS ERROR:",
                error.response?.data ||
                error.message
            );

            setReviewsError(
                error.response?.data?.message ||
                "Unable to load reviews."
            );

        } finally {

            setReviewsLoading(false);

        }
    };

    // =========================================
    // AUTH LISTENER
    // =========================================

    useEffect(() => {

        const handleAuthChange = () => {

            setIsLoggedIn(
                Boolean(
                    localStorage.getItem("token")
                )
            );

        };

        window.addEventListener(
            "authChange",
            handleAuthChange
        );

        window.addEventListener(
            "storage",
            handleAuthChange
        );

        return () => {

            window.removeEventListener(
                "authChange",
                handleAuthChange
            );

            window.removeEventListener(
                "storage",
                handleAuthChange
            );

        };

    }, []);

    // =========================================
    // BOOKING
    // =========================================

    const handleReserve = () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login", {
                state: {
                    from:
                        `/bookings/create?propertyId=${id}`
                }
            });

            return;
        }

        if (!checkIn || !checkOut) {

            alert(
                "Please select check-in and check-out dates."
            );

            return;
        }

        if (guests < 1) {

            alert(
                "Please select at least one guest."
            );

            return;
        }

        if (
            property?.maxGuests &&
            guests > property.maxGuests
        ) {

            alert(
                `This property allows a maximum of ${property.maxGuests} guests.`
            );

            return;
        }

        navigate(
            `/bookings/create?propertyId=${id}` +
            `&checkIn=${checkIn}` +
            `&checkOut=${checkOut}` +
            `&guests=${guests}`
        );
    };

    // =========================================
    // NIGHTS
    // =========================================

    const calculateNights = () => {

        if (!checkIn || !checkOut) {
            return 0;
        }

        const start =
            new Date(checkIn);

        const end =
            new Date(checkOut);

        const difference =
            end - start;

        const nights =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        return nights > 0
            ? nights
            : 0;
    };

    const nights =
        calculateNights();

    const estimatedTotal =
        property?.pricePerNight && nights
            ? property.pricePerNight * nights
            : 0;

    // =========================================
    // SUBMIT REVIEW
    // =========================================

    const handleSubmitReview = async (e) => {

        e.preventDefault();

        setReviewError("");
        setReviewMessage("");

        if (!isLoggedIn) {

            navigate("/login", {
                state: {
                    from:
                        `/properties/${id}`
                }
            });

            return;
        }

        if (reviewRating < 1) {

            setReviewError(
                "Please select a rating."
            );

            return;
        }

        if (!reviewComment.trim()) {

            setReviewError(
                "Please write a review."
            );

            return;
        }

        try {

            setReviewSubmitting(true);

            const reviewData = {
                rating: Number(reviewRating),
                comment: reviewComment.trim()
            };

            console.log(
                "REVIEW REQUEST:",
                reviewData
            );

            const response = await api.post(
                `/properties/${id}/reviews`,
                reviewData
            );

            console.log(
                "REVIEW RESPONSE:",
                response.data
            );

            setReviewRating(0);

            setReviewComment("");

            setReviewMessage(
                "Review submitted successfully!"
            );

            // Refresh reviews
            await fetchReviews();

        } catch (error) {

            console.error(
                "REVIEW SUBMIT ERROR:",
                error.response?.data ||
                error.message
            );

            setReviewError(
                error.response?.data?.message ||
                "Unable to submit review."
            );

        } finally {

            setReviewSubmitting(false);

        }
    };

    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };

    // =========================================
    // STARS
    // =========================================

    const renderStars = (rating) => {

        return (
            <div className="review-stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= rating
                                    ? "star active"
                                    : "star"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>
        );
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="property-details-message">
                Loading property...
            </div>
        );

    }

    // =========================================
    // ERROR
    // =========================================

    if (error || !property) {

        return (
            <div className="property-details-message error">

                <h2>
                    Property unavailable
                </h2>

                <p>
                    {error ||
                        "This property could not be found."}
                </p>

                <Link to="/properties">
                    ← Back to stays
                </Link>

            </div>
        );
    }

    // =========================================
    // UI
    // =========================================

    return (

        <div className="property-details-page">

            <Link
                to="/properties"
                className="property-back-link"
            >
                ← Back to stays
            </Link>


            {/* TITLE */}

            <div className="property-details-header">

    <div className="property-header-top">

        <h1>
            {property.title}
        </h1>
<div className="property-location">
        📍 {property.location}
    </div>
        

    </div>
{reviewSummary.reviewCount > 0 && (
            <div className="property-rating-summary">

                <span>★</span>

                <strong>
                    {Number(reviewSummary.averageRating).toFixed(1)}
                </strong>

                <span>·</span>

                <span>
                    {reviewSummary.reviewCount}{" "}
                    {reviewSummary.reviewCount === 1
                        ? "review"
                        : "reviews"}
                </span>

            </div>
        )}
    

</div>

            {/* =========================
    IMAGE GALLERY
========================= */}

<section className="property-gallery">

    {property.images &&
    property.images.length > 0 ? (

        <>
            {/* MAIN IMAGE */}

            <div className="property-main-image">

                <img
                     src={property.images[activeImage]?.imageUrl}
                    alt={`${property.title} ${activeImage + 1}`}
                />

            </div>


            {/* THUMBNAILS */}

            <div className="property-gallery-thumbnails">

                {property.images.map((image, index) => (
    <button
        type="button"
        key={image.id}
        className={`property-gallery-thumbnail ${
            activeImage === index ? "active" : ""
        }`}
        onClick={() => setActiveImage(index)}
    >
        <img
            src={image.imageUrl}
            alt={`${property.title} thumbnail ${index + 1}`}
        />
    </button>
))}

            </div>
        </>

    ) : property.imageUrl ? (

        /* OLD SINGLE IMAGE FALLBACK */

        <div className="property-main-image">

            <img
    src={property.images[activeImage].imageUrl}
    alt={`${property.title} ${activeImage + 1}`}
/>

        </div>

    ) : (

        <div className="property-main-image">

            <div className="property-gallery-empty">
                No image available
            </div>

        </div>

    )}

</section>


            {/* MAIN */}

            <div className="property-details-layout">


                {/* LEFT */}

                <main className="property-details-main">


                    {/* OVERVIEW */}

                    

                    <div className="property-overview">

                        <div>

                            <h2>
                                {property.title}
                            </h2>

                            <p>
                                Entire property
                                · Up to{" "}
                                {property.maxGuests}{" "}
                                guests
                            </p>

                        </div>

                    </div>

                    {/* HOST */}

                    <section className="property-section">

                       

                          <Link
        to={`/hosts/${property.ownerId}`}
        className="property-host-link"
    >

        <div className="host-info">

            <div className="host-avatar">

                {property.ownerName
                    ? property.ownerName
                        .charAt(0)
                        .toUpperCase()
                    : "H"}

            </div>

            <div>

                <strong>
                    {property.ownerName ||
                        "Wanderlust Host"}
                </strong>

                <p>
                    Property host · View profile →
                </p>

            </div>

        </div>

    </Link>

                    </section>


                    {/* FEATURES */}

                    <div className="property-features">

                        <div className="property-feature">

                            <span>
                                🏠
                            </span>

                            <div>

                                <strong>
                                    Comfortable stay
                                </strong>

                                <p>
                                    A place designed
                                    for a relaxing trip.
                                </p>

                            </div>

                        </div>


                        <div className="property-feature">

                            <span>
                                👥
                            </span>

                            <div>

                                <strong>
                                    {property.maxGuests}
                                    {" "}guests
                                </strong>

                                <p>
                                    Suitable for your group.
                                </p>

                            </div>

                        </div>


                        <div className="property-feature">

                            <span>
                                📍
                            </span>

                            <div>

                                <strong>
                                    Great location
                                </strong>

                                <p>
                                    Located in{" "}
                                    {property.location}.
                                </p>

                            </div>

                        </div>

                    </div>


                   {/* DESCRIPTION */}

<section className="property-section">

    <h2>
        About this place
    </h2>

    <p
        className={
            showFullDescription
                ? "property-description-text expanded"
                : "property-description-text"
        }
    >
        {property.description}
    </p>

    {property.description &&
        property.description.length > 180 && (
            <button
                type="button"
                className="property-description-toggle"
                onClick={() =>
                    setShowFullDescription(
                        !showFullDescription
                    )
                }
            >
                {showFullDescription
                    ? "Show less"
                    : "Show more"}
            </button>
        )}

</section>


                    


                    {/* =================================
                        REVIEWS
                    ================================= */}

                    <section className="property-section reviews-section">

                        <div className="reviews-title-row">

                            <div>

                                <h2>
                                    Reviews
                                </h2>

                                <p className="reviews-subtitle">

                                    {reviewSummary.reviewCount > 0
                                        ? `⭐ ${Number(
                                              reviewSummary.averageRating
                                          ).toFixed(
                                              1
                                          )} · ${
                                              reviewSummary.reviewCount
                                          } ${
                                              reviewSummary.reviewCount ===
                                              1
                                                  ? "review"
                                                  : "reviews"
                                          }`
                                        : "No reviews yet"}

                                </p>

                            </div>

                        </div>


                        {/* REVIEWS ERROR */}

                        {reviewsError && (

                            <div className="reviews-error">
                                {reviewsError}
                            </div>

                        )}


                        {/* LOADING */}

                        {reviewsLoading ? (

                            <div className="reviews-loading">
                                Loading reviews...
                            </div>

                        ) : reviews.length === 0 ? (

                            <div className="no-reviews">

                                <div>
                                    💬
                                </div>

                                <h3>
                                    No reviews yet
                                </h3>

                                <p>
                                    Be the first guest to
                                    share your experience.
                                </p>

                            </div>

                        ) : (

                            <div className="reviews-list">

                                {reviews.map(
                                    (review) => (

                                        <div
                                            className="review-card"
                                            key={
                                                review.id
                                            }
                                        >

                                            <div className="review-top">

                                                <div className="review-user">

                                                    <div className="review-avatar">

                                                        {(
                                                            review.userName ||
                                                            "G"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                review.userName ||
                                                                "Guest"
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                formatDate(
                                                                    review.createdAt
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                </div>


                                                {renderStars(
                                                    review.rating
                                                )}

                                            </div>


                                            <p className="review-comment">
                                                {
                                                    review.comment
                                                }
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>
                        )}


                        {/* WRITE REVIEW */}

                        <div className="write-review">

                            <h2>
                                Write a review
                            </h2>

                            {!isLoggedIn ? (

                                <div className="review-login-box">

                                    <p>
                                        Log in to share your
                                        experience.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/login",
                                                {
                                                    state: {
                                                        from:
                                                            `/properties/${id}`
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        Log In
                                    </button>

                                </div>

                            ) : (

                                <form
                                    onSubmit={
                                        handleSubmitReview
                                    }
                                    className="review-form"
                                >

                                    <label>
                                        Rating
                                    </label>

                                    <div className="rating-input">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (

                                                <button
                                                    type="button"
                                                    key={star}
                                                    className={
                                                        star <=
                                                        reviewRating
                                                            ? "rating-star selected"
                                                            : "rating-star"
                                                    }
                                                    onClick={() =>
                                                        setReviewRating(
                                                            star
                                                        )
                                                    }
                                                >
                                                    ★
                                                </button>

                                            )
                                        )}

                                    </div>


                                    <label>
                                        Your review
                                    </label>

                                    <textarea
                                        value={
                                            reviewComment
                                        }
                                        onChange={(e) =>
                                            setReviewComment(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Tell other travelers about your stay..."
                                        rows="5"
                                        maxLength="1000"
                                    />

                                    <div className="review-character-count">
                                        {
                                            reviewComment.length
                                        }{" "}
                                        / 1000
                                    </div>


                                    {reviewError && (

                                        <div className="review-form-error">
                                            {reviewError}
                                        </div>

                                    )}


                                    {reviewMessage && (

                                        <div className="review-form-success">
                                            ✓{" "}
                                            {reviewMessage}
                                        </div>

                                    )}


                                    <button
                                        type="submit"
                                        className="submit-review-button"
                                        disabled={
                                            reviewSubmitting
                                        }
                                    >

                                        {reviewSubmitting
                                            ? "Submitting..."
                                            : "Submit Review"}

                                    </button>

                                </form>
                            )}

                        </div>

                    </section>

                </main>


                {/* RIGHT — BOOKING CARD */}

                <aside className="booking-card">

                    <div className="booking-price">

                        <strong>
                            ₹
                            {property.pricePerNight?.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <span>
                            / night
                        </span>

                    </div>


                    <div className="booking-input-grid">

                        <div className="booking-input">

                            <label>
                                Check-in
                            </label>

                            <input
                                type="date"
                                value={checkIn}
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) =>
                                    setCheckIn(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="booking-input">

                            <label>
                                Check-out
                            </label>

                            <input
                                type="date"
                                value={checkOut}
                                min={
                                    checkIn ||
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) =>
                                    setCheckOut(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="booking-input">

                        <label>
                            Guests
                        </label>

                        <select
                            value={guests}
                            onChange={(e) =>
                                setGuests(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        >

                            {Array.from(
                                {
                                    length:
                                        property.maxGuests
                                },
                                (_, index) => (

                                    <option
                                        key={
                                            index + 1
                                        }
                                        value={
                                            index + 1
                                        }
                                    >

                                        {index + 1}{" "}
                                        {index === 0
                                            ? "guest"
                                            : "guests"}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {nights > 0 && (

                        <div className="booking-price-breakdown">

                            <div>

                                <span>
                                    ₹
                                    {property.pricePerNight?.toLocaleString(
                                        "en-IN"
                                    )}
                                    × {nights} nights
                                </span>

                                <strong>
                                    ₹
                                    {estimatedTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                        </div>

                    )}


                    <button
                        className="reserve-button"
                        onClick={
                            handleReserve
                        }
                    >
                        Reserve
                    </button>


                    <p className="booking-note">
                        You won't be charged yet.
                    </p>

                </aside>

            </div>

        </div>
    );
}

export default PropertyDetails;