import { useEffect, useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../services/api";


function HostBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [cancellingId, setCancellingId] = useState(null);


    // ================================
    // FETCH HOST BOOKINGS
    // ================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login", {
                state: {
                    from: "/host-bookings"
                },
                replace: true
            });

            return;
        }

        fetchHostBookings();

    }, [navigate]);


    const fetchHostBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/bookings/host"
            );

            console.log(
                "HOST BOOKINGS:",
                response.data
            );

            setBookings(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "HOST BOOKINGS ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load host bookings."
            );

        } finally {

            setLoading(false);

        }
    };


    const handleCancelBooking = async (bookingId) => {

    const confirmed = window.confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
        return;
    }

    try {

        setCancellingId(bookingId);

        await api.patch(
            `/bookings/${bookingId}/host-cancel`
        );

        setBookings((prev) =>
            prev.map((booking) =>
                booking.id === bookingId
                    ? {
                        ...booking,
                        status: "CANCELLED"
                    }
                    : booking
            )
        );

    } catch (error) {

        console.error(
            "HOST CANCEL ERROR:",
            error.response?.data || error.message
        );

        alert(
            error.response?.data?.message ||
            "Unable to cancel booking."
        );

    } finally {

        setCancellingId(null);

    }
};

    // ================================
    // FORMAT DATE
    // ================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ================================
    // STATUS CLASS
    // ================================

    const getStatusClass = (status) => {

        if (!status) {
            return "";
        }

        return status.toLowerCase();
    };


    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (
            <div className="page-message">
                Loading host bookings...
            </div>
        );
    }


    // ================================
    // ERROR
    // ================================

    if (error) {

        return (
            <div className="host-bookings-page">

                <div className="host-bookings-container">

                    <div className="host-bookings-header">

                        <div>
                            <h1>
                                Host Bookings
                            </h1>

                            <p>
                                Manage bookings for your properties.
                            </p>
                        </div>

                    </div>


                    <div className="host-bookings-error">
                        {error}
                    </div>

                </div>

            </div>
        );
    }


    return (

        <div className="host-bookings-page">

            <div className="host-bookings-container">


                {/* HEADER */}

                <div className="host-bookings-header">

                    <div>

                        <h1>
                            Host Bookings
                        </h1>

                        <p>
                            View bookings made for your properties.
                        </p>

                    </div>


                    <Link
                        to="/my-properties"
                        className="host-properties-button"
                    >
                        My Properties
                    </Link>

                </div>


                {/* EMPTY STATE */}

                {bookings.length === 0 ? (

                    <div className="host-bookings-empty">

                        <div className="empty-booking-icon">
                            📅
                        </div>

                        <h2>
                            No bookings yet
                        </h2>

                        <p>
                            When guests book one of your
                            properties, their bookings will
                            appear here.
                        </p>

                        <Link
                            to="/my-properties"
                            className="host-empty-button"
                        >
                            View My Properties
                        </Link>

                    </div>

                ) : (

                    <>


                        {/* SUMMARY */}

                        <div className="host-booking-summary">

                            <div className="booking-stat">

                                <span>
                                    Total Bookings
                                </span>

                                <strong>
                                    {bookings.length}
                                </strong>

                            </div>


                            <div className="booking-stat">

                                <span>
                                    Confirmed
                                </span>

                                <strong>
                                    {
                                        bookings.filter(
                                            (booking) =>
                                                booking.status ===
                                                "CONFIRMED"
                                        ).length
                                    }
                                </strong>

                            </div>


                            <div className="booking-stat">

                                <span>
                                    Cancelled
                                </span>

                                <strong>
                                    {
                                        bookings.filter(
                                            (booking) =>
                                                booking.status ===
                                                "CANCELLED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* BOOKINGS */}

                        <div className="host-bookings-list">

                            {bookings.map((booking) => (

                                <div
                                    className="host-booking-card"
                                    key={booking.id}
                                >
                                    <div className="host-booking-property-image">

    {booking.propertyImageUrl ? (

        <img
            src={booking.propertyImageUrl}
            alt={booking.propertyTitle}
        />

    ) : (

        <div>
            No Image
        </div>

    )}

</div>


                                    {/* TOP */}

                                    <div className="host-booking-top">

                                        <div>

                                            <span className="booking-label">
                                                Property
                                            </span>

                                            <h2>
                                                {
                                                    booking.propertyTitle ||
                                                    `Property #${booking.propertyId}`
                                                }
                                            </h2>

                                        </div>


                                        <span
    className={`host-booking-status ${getStatusClass(
        booking.status
    )}`}
>
    {booking.status === "CONFIRMED"
        ? "🟢 Confirmed"
        : "🔴 Cancelled"
    }
</span>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="host-booking-details">


                                        <div className="host-booking-detail">

                                            <span className="detail-icon">
                                                👤
                                            </span>

                                            <div>

                                                <span>
                                                    Guest
                                                </span>

                                               <strong>
                                                 {booking.guestName}
                                                </strong>

<small>
    {booking.guestEmail}
</small>

                                            </div>

                                        </div>


                                        <div className="host-booking-detail">

                                            <span className="detail-icon">
                                                📅
                                            </span>

                                            <div>

                                                <span>
                                                    Check-in
                                                </span>

                                                <strong>
                                                    {
                                                        formatDate(
                                                            booking.checkIn
                                                        )
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="host-booking-detail">

                                            <span className="detail-icon">
                                                📅
                                            </span>

                                            <div>

                                                <span>
                                                    Check-out
                                                </span>

                                                <strong>
                                                    {
                                                        formatDate(
                                                            booking.checkOut
                                                        )
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="host-booking-detail">

                                            <span className="detail-icon">
                                                👥
                                            </span>

                                            <div>

                                                <span>
                                                    Guests
                                                </span>

                                                <strong>
                                                    {booking.guests}
                                                </strong>

                                            </div>

                                        </div>


                                    </div>


                                    {/* BOTTOM */}

                                   {/* BOTTOM */}

<div className="host-booking-bottom">

    <div>

        <span>
            Total amount
        </span>

        <strong>
            ₹
            {Number(
                booking.totalPrice
            ).toLocaleString(
                "en-IN"
            )}
        </strong>

    </div>


    <div className="host-booking-actions">

        <Link
            to={`/properties/${booking.propertyId}`}
            className="host-view-property"
        >
            View Property →
        </Link>


       {booking.status === "CONFIRMED" && (

    <button
        className="host-cancel-btn"
        onClick={() =>
            handleCancelBooking(booking.id)
        }
        disabled={cancellingId === booking.id}
    >
        {cancellingId === booking.id
            ? "Cancelling..."
            : "Cancel Booking"
        }
    </button>

)}

    </div>

</div>

                                </div>

                            ))}

                        </div>

                    </>

                )}

            </div>

        </div>
    );
}


export default HostBookings;