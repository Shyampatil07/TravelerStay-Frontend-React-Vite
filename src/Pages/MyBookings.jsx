import { useEffect, useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import api from "../services/api";

function MyBookings() {

    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [cancellingId, setCancellingId] = useState(null);
const [activeFilter, setActiveFilter] = useState("ALL");

   useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        navigate("/login", {
            state: {
                from: "/bookings"
            },
            replace: true
        });

        return;
    }

    fetchBookings();

}, [navigate]);

    const fetchBookings = async () => {

    try {

        setLoading(true);
        setError("");

        const response = await api.get(
            "/bookings/my"
        );

        console.log(
            "MY BOOKINGS:",
            response.data
        );

        const bookingData =
            response.data.data || [];

       setBookings(bookingData);

    } catch (error) {

        console.error(
            "MY BOOKINGS ERROR:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            "Unable to load your bookings."
        );

    } finally {

        setLoading(false);
    }
};

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
            `/bookings/${bookingId}/cancel`
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
            "CANCEL BOOKING ERROR:",
            error.response?.data ||
            error.message
        );

        alert(
            error.response?.data?.message ||
            "Unable to cancel booking."
        );

    } finally {

        setCancellingId(null);

    }
};

const upcomingCount = bookings.filter(
    (booking) =>
        booking.bookingCategory === "UPCOMING"
).length;

const completedCount = bookings.filter(
    (booking) =>
        booking.bookingCategory === "COMPLETED"
).length;

const cancelledCount = bookings.filter(
    (booking) =>
        booking.bookingCategory === "CANCELLED"
).length;

const filteredBookings = bookings.filter((booking) => {

    if (activeFilter === "ALL") {
        return true;
    }

    return booking.bookingCategory === activeFilter;
});

const sortedBookings = [...filteredBookings].sort(
    (a, b) => {

        const dateA = new Date(a.checkIn);
        const dateB = new Date(b.checkIn);

        return dateA - dateB;
    }
);


    if (loading) {
        return (
            <div className="page-message">
                Loading your bookings...
            </div>
        );
    }


    if (error) {
        return (
            <div className="page-message error">
                {error}
            </div>
        );
    }


    return (
        <div className="my-bookings-page">

            <div className="my-bookings-header">

    <div>
        <h1>
            My Bookings
        </h1>

        <p>
            View and manage your stays.
        </p>
    </div>

</div>

<div className="booking-summary">

    <div className="booking-summary-card">
        <span>Upcoming</span>
        <strong>{upcomingCount}</strong>
        <small>Your upcoming stays</small>
    </div>

    <div className="booking-summary-card">
        <span>Completed</span>
        <strong>{completedCount}</strong>
        <small>Stays you've completed</small>
    </div>

    <div className="booking-summary-card">
        <span>Cancelled</span>
        <strong>{cancelledCount}</strong>
        <small>Cancelled bookings</small>
    </div>

</div>


            <div className="booking-filters">

    <button
        className={activeFilter === "ALL" ? "active" : ""}
        onClick={() => setActiveFilter("ALL")}
    >
        All
        <span>{" "+ bookings.length}</span>
    </button>

    <button
        className={
            activeFilter === "UPCOMING"
                ? "active"
                : ""
        }
        onClick={() => setActiveFilter("UPCOMING")}
    >
        Upcoming
        <span>{" "+ upcomingCount}</span>
    </button>

    <button
        className={
            activeFilter === "COMPLETED"
                ? "active"
                : ""
        }
        onClick={() => setActiveFilter("COMPLETED")}
    >
        Completed
        <span>{" "+ completedCount}</span>
    </button>

    <button
        className={
            activeFilter === "CANCELLED"
                ? "active"
                : ""
        }
        onClick={() => setActiveFilter("CANCELLED")}
    >
        Cancelled
        <span>{" "+ cancelledCount}</span>
    </button>

</div>

{filteredBookings.length === 0 ? (

    <div className="no-filtered-bookings">

        <div className="no-bookings-icon">
            📅  
        </div>

        <h2>
            No {activeFilter.toLowerCase()} bookings
        </h2>

        <p>
            You don't have any bookings in this category.
        </p>

    </div>

            ) : (

                <div className="bookings-list">

                 {sortedBookings.map((booking) => (

                        <div
                            className="booking-item"
                            key={booking.id}
                        >

                            {/* Property Image */}

                            <div className="booking-item-image">

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


                            {/* Booking Information */}

                            <div className="booking-item-content">

                                <div className="booking-item-header">

                                    <div>

                                        <h2>
                                           {booking.propertyTitle ||
    `Booking #${booking.id}`}
                                        </h2>

                                        <p>
                                            📍{" "}
                                           {booking.propertyLocation ||
        "Location unavailable"}
                                        </p>

                                    </div>


                                  <span
    className={`booking-status ${
        booking.bookingCategory?.toLowerCase()
    }`}
>
    {booking.bookingCategory === "UPCOMING" &&
        "🟢 Upcoming"}

    {booking.bookingCategory === "COMPLETED" &&
        "🔵 Completed"}

    {booking.bookingCategory === "CANCELLED" &&
        "🔴 Cancelled"}
</span> 
                                </div>


                                <div className="booking-info-grid">

                                    <div>

                                        <span>
                                            Check-in
                                        </span>

                                        <strong>
                                           {formatDate(booking.checkIn)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Check-out
                                        </span>

                                        <strong>
                                          {formatDate(booking.checkOut)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Guests
                                        </span>

                                        <strong>
                                            {booking.guests}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            ₹
                                            {booking.totalPrice?.toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                </div>


                                <div className="booking-item-footer">

    <span>
        Booking #{booking.id}
    </span>

    <div className="booking-actions">

        {booking.propertyId && (
            <Link
                to={`/properties/${booking.propertyId}`}
                className="view-property-link"
            >
                View property →
            </Link>
        )}

        {booking.status === "CONFIRMED" && (
            <button
                className="cancel-booking-btn"
                onClick={() =>
                    handleCancelBooking(booking.id)
                }
                disabled={
                    cancellingId === booking.id
                }
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

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyBookings;