import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function PropertyCard({ property }) {

    const [rating, setRating] = useState(null);
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {

        fetchRating();

    }, [property.id]);


    const fetchRating = async () => {

        try {

            const response = await api.get(
                `/properties/${property.id}/reviews`
            );

            const reviews =
                response.data.data || [];

            setReviewCount(reviews.length);

            if (reviews.length > 0) {

                const total = reviews.reduce(
                    (sum, review) =>
                        sum + review.rating,
                    0
                );

                const average =
                    total / reviews.length;

                setRating(
                    average.toFixed(1)
                );
            }

        } catch (error) {

            console.error(
                `Unable to load rating for property ${property.id}`,
                error
            );

        }
    };


    return (
        <Link
            to={`/properties/${property.id}`}
            className="property-card"
        >

            <div className="property-image">

                {property.imageUrl ? (

                    <img
                        src={property.imageUrl}
                        alt={property.title}
                    />

                ) : (

                    <div className="no-image">
                        No Image
                    </div>

                )}

            </div>


            <div className="property-info">

                <div className="property-title-row">

                    <h3>
                        {property.title}
                    </h3>

                    {rating ? (

                        <span>
                            ★ {rating}
                        </span>

                    ) : (

                        <span className="no-rating">
                            New
                        </span>

                    )}

                </div>


                <p className="property-location">
                    {property.location}
                </p>


                <p className="property-description">
                    {property.description}
                </p>


                <p className="property-guests">
                    👥 Up to {property.maxGuests} guests
                </p>


                <p className="property-price">

                    ₹{property.pricePerNight}

                    <span>
                        {" "}night
                    </span>

                </p>


                {reviewCount > 0 && (

                    <p className="property-review-count">
                        {reviewCount}{" "}
                        {reviewCount === 1
                            ? "review"
                            : "reviews"}
                    </p>

                )}

            </div>

        </Link>
    );
}

export default PropertyCard;