import { Link, useLocation } from "react-router-dom";

function BookingSuccess() {

    const location = useLocation();

    const booking = location.state?.booking;

    if (!booking) {
        return (
            <div className="page-message">

                <div>
                    <h2>
                        Booking information not found.
                    </h2>

                    <Link to="/properties">
                        Back to stays
                    </Link>
                </div>

            </div>
        );
    }

    return (
        <div className="booking-success-page">

            <div className="success-card">

                <div className="success-icon">
                    ✓
                </div>

                <h1>
                    Booking Confirmed!
                </h1>

                <p className="success-message">
                    Your stay has been successfully booked.
                </p>


                <div className="success-details">

                    <div className="success-row">

                        <span>
                            Booking ID
                        </span>

                        <strong>
                            #{booking.id}
                        </strong>

                    </div>


                    <div className="success-row">

                        <span>
                            Check-in
                        </span>

                        <strong>
                            {booking.checkIn}
                        </strong>

                    </div>


                    <div className="success-row">

                        <span>
                            Check-out
                        </span>

                        <strong>
                            {booking.checkOut}
                        </strong>

                    </div>


                    <div className="success-row">

                        <span>
                            Guests
                        </span>

                        <strong>
                            {booking.guests}
                        </strong>

                    </div>


                    <div className="success-row total-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{booking.totalPrice}
                        </strong>

                    </div>

                </div>


                <div className="success-status">

                    <span>
                        Status
                    </span>

                    <strong>
                        {booking.status}
                    </strong>

                </div>


                <div className="success-actions">

                    <Link
                        to="/properties"
                        className="success-primary-button"
                    >
                        Explore more stays
                    </Link>

                    <Link
                        to="/bookings"
                        className="success-secondary-button"
                    >
                        My Bookings
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default BookingSuccess;