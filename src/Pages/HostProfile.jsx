import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import "./HostProfile.css";


function HostProfile() {

    const { hostId } = useParams();

    const [host, setHost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
const [saving, setSaving] = useState(false);
const [uploadingPhoto, setUploadingPhoto] = useState(false);

const [editName, setEditName] = useState("");
const [editPhone, setEditPhone] = useState("");
const [editAbout, setEditAbout] = useState("");

const fileInputRef = useRef(null);


    // ==========================================
    // FETCH HOST PROFILE
    // ==========================================

    useEffect(() => {

        fetchHostProfile();

    }, [hostId]);


    const fetchHostProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/hosts/${hostId}`
            );

            console.log(
                "HOST PROFILE RESPONSE:",
                response.data
            );

            if (response.data?.success) {

                setHost(response.data.data);

            } else {

                setError(
                    response.data?.message ||
                    "Unable to load host profile."
                );

            }

        } catch (error) {

            console.error(
                "HOST PROFILE ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load host profile."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleEditProfile = () => {

    setEditName(host.name || "");
    setEditPhone(host.phone || "");
    setEditAbout(host.about || "");

    setIsEditing(true);
};

    
     const handleSaveProfile = async () => {

    try {

        setSaving(true);
        setError("");

        const response = await api.put(
            "/hosts/profile",
            {
                name: editName,
                phone: editPhone,
                about: editAbout
            }
        );

        if (response.data?.success) {

            setHost(response.data.data);

            setIsEditing(false);

        } else {

            setError(
                response.data?.message ||
                "Unable to update profile."
            );
        }

    } catch (error) {

        console.error(
            "UPDATE HOST PROFILE ERROR:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            "Unable to update profile."
        );

    } finally {

        setSaving(false);
    }
};

    const handlePhotoChange = async (event) => {

    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        setError("Please select an image file.");

        return;
    }

    if (file.size > 5 * 1024 * 1024) {

        setError("Profile image must be smaller than 5 MB.");

        return;
    }

    try {

        setUploadingPhoto(true);
        setError("");

        const formData = new FormData();

        formData.append("file", file);

        const response = await api.post(
            "/hosts/profile/photo",
            formData
        );

        if (response.data?.success) {

            setHost(response.data.data);

        } else {

            setError(
                response.data?.message ||
                "Unable to upload profile photo."
            );
        }

    } catch (error) {

        console.error(
            "PROFILE PHOTO ERROR:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            "Unable to upload profile photo."
        );

    } finally {

        setUploadingPhoto(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
};


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="host-profile-page">

                <div className="host-profile-loading">

                    <div className="host-profile-spinner"></div>

                    <p>
                        Loading host profile...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !host) {

        return (
            <div className="host-profile-page">

                <div className="host-profile-error">

                    <div className="host-profile-error-icon">
                        👤
                    </div>

                    <h2>
                        Host profile unavailable
                    </h2>

                    <p>
                        {error ||
                            "This host profile could not be found."}
                    </p>

                    <Link
                        to="/properties"
                        className="host-profile-back-button"
                    >
                        ← Back to stays
                    </Link>

                </div>

            </div>
        );
    }


    // ==========================================
    // HOST INITIAL
    // ==========================================

    const hostInitial =
        host.name
            ? host.name.charAt(0).toUpperCase()
            : "H";


    return (

        <div className="host-profile-page">

    <div className="host-profile-container">

        {/* HEADER */}

        <section className="host-profile-header">

            <div className="host-profile-avatar">

                {host.profileImageUrl ? (
                    <img
                        src={host.profileImageUrl}
                        alt={host.name}
                    />
                ) : (
                    host.name?.charAt(0).toUpperCase()
                )}

                {/* <button
            type="button"
            className="host-profile-photo-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
        >
            {uploadingPhoto
                ? "Uploading..."
                : "Change photo"}
        </button>

        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
        /> */}

            </div>

            <div className="host-profile-header-content">

                <p className="host-profile-eyebrow">
                    HOST PROFILE
                </p>

                <h1>
                    {host.name}
                </h1>

                <p>
                    Hosting on Wanderlust
                </p>

                 {/* <button
            type="button"
            className="host-profile-edit-button"
            onClick={handleEditProfile}
        >
            Edit profile
        </button> */}

            </div>

        {/* SEPARATE PROFILE PHOTO OPTION */}

    <div className="host-profile-photo-actions">

        <button
            type="button"
            className="host-profile-photo-button"
            onClick={() =>
                fileInputRef.current?.click()
            }
            disabled={uploadingPhoto}
        >
            {uploadingPhoto
                ? "Uploading..."
                : "Change Profile Photo"}
        </button>

        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
        />

    </div>

    <button
        type="button"
        className="host-profile-edit-button"
        onClick={handleEditProfile}
    >
        Edit Profile
    </button>    

        </section>

        {isEditing && (

    <section className="host-profile-edit-section">

        <div className="host-profile-section-header">

            <div>
                <h2>
                    Edit profile
                </h2>

                <p>
                    Update your host information
                </p>
            </div>

        </div>

        <div className="host-profile-edit-form">

            <div className="host-profile-form-group">

                <label>
                    Name
                </label>

                <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                        setEditName(e.target.value)
                    }
                    placeholder="Enter your name"
                />

            </div>


            <div className="host-profile-form-group">

                <label>
                    Phone
                </label>

                <input
                    type="text"
                    value={editPhone}
                    onChange={(e) =>
                        setEditPhone(e.target.value)
                    }
                    placeholder="Enter your phone number"
                />

            </div>


            <div className="host-profile-form-group">

                <label>
                    About
                </label>

                <textarea
                    value={editAbout}
                    onChange={(e) =>
                        setEditAbout(e.target.value)
                    }
                    placeholder="Tell guests something about yourself"
                    rows="4"
                />

            </div>


            <div className="host-profile-edit-actions">

                <button
                    type="button"
                    className="host-profile-cancel-button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="host-profile-save-button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save changes"}
                </button>

            </div>

        </div>

    </section>
)}


        {/* STATS */}

        <section className="host-profile-stats">

            <div className="host-stat">
                <strong>
                    {host.totalProperties}
                </strong>
                <span>
                    Properties
                </span>
            </div>

            <div className="host-stat">
                <strong>
                    {host.averageRating
                        ? host.averageRating.toFixed(1)
                        : "0.0"}
                </strong>
                <span>
                    Average rating
                </span>
            </div>

            <div className="host-stat">
                <strong>
                    {host.totalReviews}
                </strong>
                <span>
                    Reviews
                </span>
            </div>

        </section>


        {/* ABOUT */}

        <section className="host-profile-section">
               <div className="host-profile-section-header">

                     <h2>
                            Meet your host 
                        </h2>

                        <span>
                            
                        </span>
                </div>


            <p>
                {host.about ||
                    `${host.name} is a host on Wanderlust who welcomes guests and shares comfortable stays with travelers.`}
            </p>

        </section>


        {/* HOSTING SINCE */}

        <section className="host-profile-section">

            <h2>
                Hosting since
            </h2>

            <p>
                {host.hostingSince
                    ? new Date(
                        host.hostingSince
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            month: "long",
                            year: "numeric"
                        }
                    )
                    : "Hosting on Wanderlust"}
            </p>

        </section>

        {/* ==================================
                    HOST DETAILS
                ================================== */}

                <section className="host-profile-section">

                    <h2>
                        Host details
                    </h2>


                    <div className="host-profile-details">


                        <div className="host-profile-detail">

                            <span className="host-profile-detail-icon">
                                👤
                            </span>

                            <div>

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {host.name || "-"}
                                </strong>

                            </div>

                        </div>


                        <div className="host-profile-detail">

                            <span className="host-profile-detail-icon">
                                ✉️
                            </span>

                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {host.email || "-"}
                                </strong>

                            </div>

                        </div>


                        {host.phone && (

                            <div className="host-profile-detail">

                                <span className="host-profile-detail-icon">
                                    📞
                                </span>

                                <div>

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {host.phone}
                                    </strong>

                                </div>

                            </div>

                        )}

                    </div>

                </section>


        {/* REVIEWS */}

        <section className="host-profile-section">

            <div className="host-section-heading">

                <div>
                    <h2>
                        Reviews from guests
                    </h2>

                    <p>
                        {host.totalReviews}{" "}
                        {host.totalReviews === 1
                            ? "review"
                            : "reviews"}
                    </p>
                </div>

            </div>


            {host.reviews?.length > 0 ? (

                <div className="host-reviews-list">

                    {host.reviews.map((review) => (

                        <article
                            className="host-review-card"
                            key={review.id}
                        >

                            <div className="host-review-header">

                                <div className="host-review-avatar">
                                    {review.guestName
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <strong>
                                        {review.guestName}
                                    </strong>

                                    <p>
                                        {review.propertyTitle}
                                    </p>

                                </div>

                            </div>


                            <div className="host-review-rating">
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                            </div>


                            <p className="host-review-comment">
                                {review.comment}
                            </p>


                            <span className="host-review-date">
                                {review.createdAt
                                    ? new Date(
                                        review.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            month: "long",
                                            year: "numeric"
                                        }
                                    )
                                    : ""}
                            </span>

                        </article>

                    ))}

                </div>

            ) : (

                <div className="host-empty-state">
                    No guest reviews yet.
                </div>

            )}

        </section>


        {/* HOST PROPERTIES */}

        <section className="host-profile-section">

            <div className="host-section-heading">

                <div>

                    <h2>
                        {host.name}'s stays
                    </h2>

                    <p>
                        Properties listed on Wanderlust
                    </p>

                </div>

            </div>

            


            {host.properties?.length > 0 ? (

                <div className="host-properties-grid">

                    {host.properties.map((property) => (

                        <Link
                            key={property.id}
                            to={`/properties/${property.id}`}
                            className="host-property-card"
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

                            <div className="host-property-content">

                                <h3>
                                    {property.title}
                                </h3>

                                <p>
                                    📍 {property.location}
                                </p>

                                <div className="host-property-bottom">

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

                            </div>

                        </Link>

                    ))}

                </div>

            ) : (

                <div className="host-empty-state">
                    This host has no properties listed yet.
                </div>

            )}

            {/* ==================================
                    BACK TO STAYS
                ================================== */}

                <div className="host-profile-footer-action">

                    <Link
                        to="/properties"
                        className="host-profile-explore-button"
                    >
                        Explore stays
                    </Link>

                </div>


        </section>

    </div>

</div>
    );
}


export default HostProfile;