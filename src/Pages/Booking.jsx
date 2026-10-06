import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";


function Booking() {

    

    const token = localStorage.getItem("token");

    const [searchParams] = useSearchParams();

const propertyId = searchParams.get("propertyId");

const initialCheckIn =
    searchParams.get("checkIn") || "";

const initialCheckOut =
    searchParams.get("checkOut") || "";

const initialGuests =
    Number(
        searchParams.get("guests") || 1
    );

    const navigate = useNavigate();
    
    

    const [property, setProperty] = useState(null);

const [checkIn, setCheckIn] =
    useState(initialCheckIn);

const [checkOut, setCheckOut] =
    useState(initialCheckOut);

const [guests, setGuests] =
    useState(initialGuests);

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        navigate("/login", {
            state: {
                from: `/bookings/create?propertyId=${propertyId}`
            },
            replace: true
        });

        return;
    }

    if (!propertyId) {

        setError("Property not found.");
        setLoading(false);

        return;
    }

    fetchProperty();

}, [propertyId, navigate]);

    const fetchProperty = async () => {

        try {

            const response = await api.get(
                `/properties/${propertyId}`
            );

            setProperty(response.data.data);

        } catch (error) {

            console.error(error);

            setError("Unable to load property.");

        } finally {

            setLoading(false);

        }
    };


    const handleBooking = async (e) => {

        e.preventDefault();

        setError("");

        if (!checkIn || !checkOut) {
            setError("Please select check-in and check-out dates.");
            return;
        }

        if (checkOut <= checkIn) {
            setError("Check-out date must be after check-in date.");
            return;
        }

        if (guests < 1) {
            setError("Guests must be at least 1.");
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

        try {

            setBookingLoading(true);

            const bookingData = {
                propertyId: Number(propertyId),
                checkIn: checkIn,
                checkOut: checkOut,
                guests: Number(guests)
            };

            console.log(
                "BOOKING REQUEST:",
                bookingData
            );

            const response = await api.post(
                "/bookings",
                bookingData
            );

            console.log(
                "BOOKING RESPONSE:",
                response.data
            );

            const booking = response.data.data;

            navigate(
                `/booking-success/${booking.id}`,
                {
                    state: {
                        booking: booking
                    }
                }
            );

        } catch (error) {

            console.error(
                "BOOKING ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to create booking."
            );

        } finally {

            setBookingLoading(false);

        }
    };


    if (loading) {
        return (
            <div className="page-message">
                Loading booking page...
            </div>
        );
    }


    if (error && !property) {
        return (
            <div className="page-message error">
                {error}
            </div>
        );
    }

    const calculateNights = () => {

    if (!checkIn || !checkOut) {
        return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference =
        end.getTime() - start.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
    };

    const nights = calculateNights();

        const estimatedTotal =
    nights * property.pricePerNight;


    return (
        <div className="booking-page">

            <div className="booking-container">

                {/* Left Side */}


                <div className="booking-form-section">

                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <h1>
                        Confirm your booking
                    </h1>

                    <p className="booking-subtitle">
                        Choose your dates and number of guests.
                    </p>


                    {error && (
                        <div className="booking-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleBooking}>

                        {/* Dates */}

                        <div className="booking-form-row">

                            <div className="form-group">

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
                                        setCheckIn(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Check-out
                                </label>

                                <input
                                    type="date"
                                    value={checkOut}
                                    min={checkIn || undefined}
                                    onChange={(e) =>
                                        setCheckOut(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* Guests */}

                        <div className="form-group">

                            <label>
                                Guests
                            </label>

                            <input
                                type="number"
                                min="1"
                                max={property.maxGuests}
                                value={guests}
                                onChange={(e) =>
                                    setGuests(e.target.value)
                                }
                                required
                            />

                            <small>
                                Maximum {property.maxGuests} guests
                            </small>

                        </div>


                        <button
                            type="submit"
                            className="confirm-booking-button"
                            disabled={bookingLoading}
                        >
                            {bookingLoading
                                ? "Confirming..."
                                : "Confirm Booking"
                            }
                        </button>

                    </form>

                </div>


                {/* Property Summary */}

                <aside className="booking-summary">

                    <div className="summary-image">

                        {property.imageUrl ? (

                            <img
                                src={property.imageUrl}
                                alt={property.title}
                            />

                        ) : (

                            <div>
                                No Image
                            </div>

                        )}

                    </div>


                    <div className="summary-content">

                        <h2>
                            {property.title}
                        </h2>

                        <p className="summary-location">
                            📍 {property.location}
                        </p>


                        <hr />


                       <div className="summary-row">

                       <div className="price-line">
                            <span>
                                 ₹{property.pricePerNight} × {nights || 0} nights
                            </span>

                            <span>
                             ₹{estimatedTotal.toLocaleString("en-IN")}
                             </span>
                        </div>

                        </div>


                        <div className="summary-guests">

                            <span>
                                👥 Guests
                            </span>

                            <strong>
                                Up to {property.maxGuests}
                            </strong>

                        </div>

                        <div className="summary-total">

                        <strong>
                         Estimated total
                        </strong>

                        <strong>
                             ₹{estimatedTotal.toLocaleString("en-IN")}
                        </strong>

                        </div>


                        <p className="summary-note">
                            Your final total will be calculated
                            based on the number of nights.
                        </p>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default Booking;