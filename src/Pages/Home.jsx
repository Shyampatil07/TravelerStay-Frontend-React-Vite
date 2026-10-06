import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Home.css";

function Home() {

    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [location, setLocation] = useState("");
    const [guests, setGuests] = useState("");

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/properties"
            );

            setProperties(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "HOME PROPERTIES ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load properties."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleSearch = () => {

        const params = new URLSearchParams();

        if (location.trim()) {
            params.append(
                "location",
                location.trim()
            );
        }

        if (guests) {
            params.append(
                "guests",
                guests
            );
        }

        navigate(
            `/properties?${params.toString()}`
        );
    };

    const popularLocations = [
        "Pune",
        "Mumbai",
        "Goa",
        "Bangalore"
    ];

    return (
        <div className="home-page">

            {/* Hero */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <span className="hero-badge">
                        ✦ Find your next stay
                    </span>

                    <h1>
                        Stay somewhere
                        <br />
                        <span>you'll remember.</span>
                    </h1>

                    <p>
                        Discover comfortable stays,
                        unique properties and places
                        worth experiencing.
                    </p>


                    {/* Search */}

                    <div className="home-search">

                        <div className="search-field">

                            <span className="search-icon">
                                📍
                            </span>

                            <div>
                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    placeholder="Where are you going?"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>


                        <div className="search-divider" />


                        <div className="search-field">

                            <span className="search-icon">
                                👥
                            </span>

                            <div>
                                <label>
                                    Guests
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Add guests"
                                    value={guests}
                                    onChange={(e) =>
                                        setGuests(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>


                        <button
                            className="home-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                    </div>

                </div>

            </section>


            {/* Popular Locations */}

            <section className="home-section">

                <div className="section-heading">

                    <div>
                        <span className="section-label">
                            EXPLORE
                        </span>

                        <h2>
                            Popular destinations
                        </h2>

                        <p>
                            Find a stay in places
                            people love to visit.
                        </p>
                    </div>

                    <Link
                        to="/properties"
                        className="view-all-link"
                    >
                        View all →
                    </Link>

                </div>


                <div className="destination-list">

                    {popularLocations.map(
                        (city) => (

                            <button
                                key={city}
                                className="destination-pill"
                                onClick={() =>
                                    navigate(
                                        `/properties?location=${city}`
                                    )
                                }
                            >
                                📍 {city}
                            </button>

                        )
                    )}

                </div>

            </section>


            {/* Properties */}

            <section className="home-section">

                <div className="section-heading">

                    <div>
                        <span className="section-label">
                            STAYS
                        </span>

                        <h2>
                            Explore stays
                        </h2>

                        <p>
                            Handpicked places for
                            your next trip.
                        </p>
                    </div>

                    <Link
                        to="/properties"
                        className="view-all-link"
                    >
                        See all stays →
                    </Link>

                </div>


                {loading && (

                    <div className="home-message">
                        Loading stays...
                    </div>

                )}


                {error && (

                    <div className="home-message error">
                        {error}
                    </div>

                )}


                {!loading &&
                    !error &&
                    properties.length === 0 && (

                        <div className="home-message">
                            No properties available yet.
                        </div>

                    )}


                {!loading &&
                    !error &&
                    properties.length > 0 && (

                        <div className="property-grid">

                            {properties
                                .slice(0, 8)
                                .map(
                                    (property) => (

                                        <Link
                                            key={
                                                property.id
                                            }
                                            to={`/properties/${property.id}`}
                                            className="home-property-card"
                                        >
                                                {/* Image */}
                                            <div className="home-property-image">

                                                {property.images && property.images.length > 0 ? (
    <img
        src={property.images[0].imageUrl}
        alt={property.title}
    />
) : property.imageUrl ? (
    <img
        src={property.imageUrl}
        alt={property.title}
    />
) : (
    <div className="property-image-placeholder">
        No Image
    </div>
)}

                                            </div>


                                            <div className="home-property-content">

                                                <div className="property-card-top">

                                                    <h3>
                                                        {
                                                            property.title
                                                        }
                                                    </h3>

                                                    <span>
                                                        ₹
                                                        {
                                                            property.pricePerNight?.toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }
                                                        <small>
                                                            / night
                                                        </small>
                                                    </span>

                                                </div>


                                                <p className="property-location">
                                                    📍{" "}
                                                    {
                                                        property.location
                                                    }
                                                </p>


                                                <p className="property-guests">
                                                    👥 Up to{" "}
                                                    {
                                                        property.maxGuests
                                                    }{" "}
                                                    guests
                                                </p>

                                            </div>

                                        </Link>

                                    )
                                )}

                        </div>

                    )}

            </section>


            {/* Host CTA */}

            <section className="host-cta">

                <div>

                    <span>
                        HAVE A PROPERTY?
                    </span>

                    <h2>
                        Turn your space
                        into a stay.
                    </h2>

                    <p>
                        Share your property with
                        travelers and start hosting
                        on Wanderlust.
                    </p>

                </div>

                <Link
                    to="/create-property"
                    className="host-cta-button"
                >
                    Become a host →
                </Link>

            </section>

        </div>
    );
}

export default Home;