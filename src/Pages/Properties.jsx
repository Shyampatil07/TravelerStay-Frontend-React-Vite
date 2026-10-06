import { useEffect, useState } from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";
import api from "../services/api";
import "./Properties.css";

function Properties() {

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [properties, setProperties] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // Filter states

    const [location, setLocation] =
        useState(
            searchParams.get("location") || ""
        );

    const [minPrice, setMinPrice] =
        useState(
            searchParams.get("minPrice") || ""
        );

    const [maxPrice, setMaxPrice] =
        useState(
            searchParams.get("maxPrice") || ""
        );

    const [guests, setGuests] =
        useState(
            searchParams.get("guests") || ""
        );

    const [sort, setSort] =
        useState(
            searchParams.get("sort") || ""
        );


    // =========================
    // FETCH PROPERTIES
    // =========================

    useEffect(() => {

        fetchProperties();

    }, [searchParams]);


    const fetchProperties = async () => {

        try {

            setLoading(true);
            setError("");

            const params = {};

            const locationParam =
                searchParams.get("location");

            const minPriceParam =
                searchParams.get("minPrice");

            const maxPriceParam =
                searchParams.get("maxPrice");

            const guestsParam =
                searchParams.get("guests");

            const sortParam =
                searchParams.get("sort");


            if (locationParam) {
                params.location = locationParam;
            }

            if (minPriceParam) {
                params.minPrice =
                    minPriceParam;
            }

            if (maxPriceParam) {
                params.maxPrice =
                    maxPriceParam;
            }

            if (guestsParam) {
                params.guests =
                    guestsParam;
            }

            if (sortParam) {
                params.sort =
                    sortParam;
            }


            const response = await api.get(
                "/properties",
                {
                    params
                }
            );


            setProperties(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "PROPERTIES ERROR:",
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


    // =========================
    // APPLY FILTERS
    // =========================

    const handleApplyFilters = () => {

        const params = {};

        if (location.trim()) {
            params.location =
                location.trim();
        }

        if (minPrice) {
            params.minPrice =
                minPrice;
        }

        if (maxPrice) {
            params.maxPrice =
                maxPrice;
        }

        if (guests) {
            params.guests =
                guests;
        }

        if (sort) {
            params.sort =
                sort;
        }


        setSearchParams(params);

    };


    // =========================
    // CLEAR FILTERS
    // =========================

    const handleClearFilters = () => {

        setLocation("");
        setMinPrice("");
        setMaxPrice("");
        setGuests("");
        setSort("");

        setSearchParams({});

    };


    return (

        <div className="properties-page">

            {/* =========================
                HEADER
            ========================= */}

            <section className="properties-header">

                <div>

                    <span className="properties-label">
                        DISCOVER
                    </span>

                    <h1>
                        Explore stays
                    </h1>

                    <p>
                        Find a place that feels
                        right for your next trip.
                    </p>

                </div>

            </section>


            {/* =========================
                FILTER PANEL
            ========================= */}

            <section className="filter-panel">

                <div className="filter-field">

                    <label>
                        Location
                    </label>

                    <input
                        type="text"
                        placeholder="Search location"
                        value={location}
                        onChange={(e) =>
                            setLocation(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-field">

                    <label>
                        Min price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="₹ Min"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-field">

                    <label>
                        Max price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="₹ Max"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-field">

                    <label>
                        Guests
                    </label>

                    <input
                        type="number"
                        min="1"
                        placeholder="Guests"
                        value={guests}
                        onChange={(e) =>
                            setGuests(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-field">

                    <label>
                        Sort
                    </label>

                    <select
                        value={sort}
                        onChange={(e) =>
                            setSort(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Recommended
                        </option>

                        <option value="priceAsc">
                            Price: Low to High
                        </option>

                        <option value="priceDesc">
                            Price: High to Low
                        </option>

                    </select>

                </div>


                <div className="filter-actions">

                    <button
                        className="apply-filter-button"
                        onClick={
                            handleApplyFilters
                        }
                    >
                        Search
                    </button>

                    <button
                        className="clear-filter-button"
                        onClick={
                            handleClearFilters
                        }
                    >
                        Clear
                    </button>

                </div>

            </section>


            {/* =========================
                RESULTS HEADER
            ========================= */}

            <div className="results-header">

                <div>

                    <h2>
                        {loading
                            ? "Finding stays..."
                            : `${properties.length} ${
                                properties.length === 1
                                    ? "stay"
                                    : "stays"
                            }`
                        }
                    </h2>

                    {!loading &&
                        searchParams.get(
                            "location"
                        ) && (

                            <p>
                                Results for "
                                {
                                    searchParams.get(
                                        "location"
                                    )
                                }
                                "
                            </p>

                        )}

                </div>

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loading && (

                <div className="properties-message">

                    <div className="loading-spinner" />

                    <p>
                        Loading stays...
                    </p>

                </div>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (

                <div className="properties-message error">

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchProperties}
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* =========================
                EMPTY
            ========================= */}

            {!loading &&
                !error &&
                properties.length === 0 && (

                    <div className="properties-message">

                        <div className="empty-icon">
                            🏠
                        </div>

                        <h3>
                            No stays found
                        </h3>

                        <p>
                            Try changing your
                            search or removing
                            some filters.
                        </p>

                        <button
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear filters
                        </button>

                    </div>

                )}


            {/* =========================
                PROPERTY GRID
            ========================= */}

            {!loading &&
                !error &&
                properties.length > 0 && (

                    <div className="properties-grid">

                        {properties.map(
                            (property) => (

                                <Link
                                    key={
                                        property.id
                                    }
                                    to={`/properties/${property.id}`}
                                    className="property-card"
                                >

                                    {/* Image */}

                                    <div className="property-card-image">

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


                                    {/* Content */}

                                    <div className="property-card-content">

                                        <div className="property-card-heading">

                                            <h3>
                                                {
                                                    property.title
                                                }
                                            </h3>

                                            <strong>
                                                ₹
                                                {
                                                    property
                                                        .pricePerNight
                                                        ?.toLocaleString(
                                                            "en-IN"
                                                        )
                                                }
                                                <small>
                                                    / night
                                                </small>
                                            </strong>

                                        </div>


                                        <p className="property-card-location">

                                            📍{" "}

                                            {
                                                property.location
                                            }

                                        </p>


                                        <p className="property-card-guests">

                                            👥 Up to{" "}

                                            {
                                                property.maxGuests
                                            }

                                            {" "}guests

                                        </p>

                                    </div>

                                </Link>

                            )
                        )}

                    </div>

                )}

        </div>

    );
}

export default Properties;