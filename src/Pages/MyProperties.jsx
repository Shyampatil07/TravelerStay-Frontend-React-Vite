import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
 import "./MyProperties.css";

function MyProperties() {
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const fetchMyProperties = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/properties/my");

            console.log("MY PROPERTIES RESPONSE:", response.data);

            if (response.data?.success) {
                setProperties(response.data.data || []);
            } else {
                setProperties([]);
                setError(
                    response.data?.message ||
                    "Failed to load your properties."
                );
            }
        } catch (err) {
            console.error("MY PROPERTIES ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load your properties."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (propertyId) => {
        if (!propertyId) {
            console.error("Invalid property ID:", propertyId);
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this property?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(propertyId);

            await api.delete(`/properties/${propertyId}`);

            setProperties((prevProperties) =>
                prevProperties.filter(
                    (property) => property.id !== propertyId
                )
            );

            alert("Property deleted successfully.");
        } catch (err) {
            console.error("DELETE PROPERTY ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Failed to delete property."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getImageUrl = (property) => {
        if (property?.imageUrl) {
            return property.imageUrl;
        }

        return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80";
    };

    if (loading) {
        return (
            <div className="my-properties-page">
                <div className="my-properties-container">
                    <div className="page-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your properties...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-properties-page">
            <div className="my-properties-container">

                {/* Header */}
                <div className="my-properties-header">
                    <div>
                        <p className="page-eyebrow">HOST DASHBOARD</p>

                        <h1>My Properties</h1>

                        <p className="page-subtitle">
                            Manage the stays you have listed on Wanderlust.
                        </p>
                    </div>

                    <button
                        className="add-property-btn"
                        onClick={() => navigate("/create-property")}
                    >
                        <span>+</span>
                        Add Property
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="property-error">
                        <strong>Something went wrong</strong>
                        <p>{error}</p>

                        <button onClick={fetchMyProperties}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!error && properties.length === 0 && (
                    <div className="empty-properties">
                        <div className="empty-icon">🏡</div>

                        <h2>No properties yet</h2>

                        <p>
                            You haven't listed any properties yet.
                            Start hosting and share your place with travelers.
                        </p>

                        <button
                            onClick={() => navigate("/create-property")}
                            className="empty-add-btn"
                        >
                            Add Your First Property
                        </button>
                    </div>
                )}

                {/* Property Grid */}
                {!error && properties.length > 0 && (
                    <>
                        <div className="properties-count">
                            <strong>{properties.length}</strong>{" "}
                            {properties.length === 1
                                ? "property"
                                : "properties"}{" "}
                            listed
                        </div>

                        <div className="my-properties-grid">
                            {properties.map((property) => {

                                

                                /*
                                 * Important:
                                 * The backend PropertyResponse uses:
                                 *
                                 * id
                                 * title
                                 * description
                                 * location
                                 * pricePerNight
                                 * maxGuests
                                 * imageUrl
                                 * ownerId
                                 */

                                const propertyId = property?.id;

                                 const thumbnail =
        property.images?.length > 0
            ? property.images[0].imageUrl
            : property.imageUrl;

                                return (
                                    <article
                                        className="my-property-card"
                                        key={propertyId}
                                    >

                                        {/* Image */}
                                        <div className="property-card-image">

                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={property.title}
                    />
                ) : (
                    <div className="property-image-placeholder">
                        No Image
                    </div>
                )}

            </div>

                                        {/* Content */}
                                        <div className="my-property-content">

                                            <div className="property-card-top">
                                                <div>
                                                    <p className="property-location">
                                                        📍{" "}
                                                        {property.location ||
                                                            "Location unavailable"}
                                                    </p>

                                                    <h2>
                                                        {property.title ||
                                                            "Untitled Property"}
                                                    </h2>
                                                </div>
                                            </div>

                                            <p className="property-description">
                                                {property.description
                                                    ? property.description.length >
                                                      110
                                                        ? `${property.description.substring(
                                                              0,
                                                              110
                                                          )}...`
                                                        : property.description
                                                    : "No description available."}
                                            </p>

                                            <div className="property-meta">
                                                <span>
                                                    👥 Up to{" "}
                                                    {property.maxGuests || 0}{" "}
                                                    guests
                                                </span>

                                                <span>
                                                    ₹
                                                    {Number(
                                                        property.pricePerNight ||
                                                            0
                                                    ).toLocaleString("en-IN")}
                                                    / night
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="property-actions">

                                                <Link
                                                    to={
                                                        propertyId
                                                            ? `/properties/${propertyId}`
                                                            : "#"
                                                    }
                                                    className="view-property-btn"
                                                    onClick={(event) => {
                                                        if (!propertyId) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    View Property
                                                </Link>

                                                <Link
                                                    to={
                                                        propertyId
                                                            ? `/edit-property/${propertyId}`
                                                            : "#"
                                                    }
                                                    className="edit-property-btn"
                                                    onClick={(event) => {
                                                        if (!propertyId) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="delete-property-btn"
                                                    disabled={
                                                        deletingId ===
                                                        propertyId
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            propertyId
                                                        )
                                                    }
                                                >
                                                    {deletingId === propertyId
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })} 
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MyProperties;