import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./EditProperty.css";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        pricePerNight: "",
        maxGuests: ""
    });

    const [existingImages, setExistingImages] = useState([]);

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/properties/${id}`);

            const data = response.data.data;

            setFormData({
                title: data.title || "",
                description: data.description || "",
                location: data.location || "",
                pricePerNight: data.pricePerNight || "",
                maxGuests: data.maxGuests || ""
            });

            /*
             * New multi-image response:
             * data.imageUrls = [...]
             *
             * Fallback to old imageUrl so old properties
             * continue working.
             */
            if (data.images && data.images.length > 0) {
    setExistingImages(data.images);
} else if (data.imageUrl) {
    setExistingImages([
        {
            id: null,
            imageUrl: data.imageUrl
        }
    ]);
} else {
    setExistingImages([]);
}

        } catch (err) {
            console.error("Error fetching property:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load property"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (selectedFiles.length === 0) {
            return;
        }

        const validImages = [];
        const previews = [];

        for (const file of selectedFiles) {

            if (!file.type.startsWith("image/")) {
                alert(`${file.name} is not a valid image.`);
                continue;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} is larger than 5MB.`);
                continue;
            }

            validImages.push(file);
            previews.push(URL.createObjectURL(file));
        }

        /*
         * Add new files to already selected files.
         * This allows the host to select images multiple times.
         */
        setImages((prev) => [
            ...prev,
            ...validImages
        ]);

        setImagePreviews((prev) => [
            ...prev,
            ...previews
        ]);

        // Allows selecting the same file again if needed.
        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setImagePreviews((prev) => {
            const updated = [...prev];

            URL.revokeObjectURL(updated[index]);

            updated.splice(index, 1);

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            /*
             * Step 1:
             * Update property information.
             */
            await api.put(`/properties/${id}`, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                pricePerNight: Number(formData.pricePerNight),
                maxGuests: Number(formData.maxGuests)
            });

            /*
             * Step 2:
             * Upload newly selected images.
             *
             * Existing images are NOT deleted.
             */
            if (images.length > 0) {

                const formDataImages = new FormData();

                images.forEach((image) => {
                    formDataImages.append("files", image);
                });

                await api.post(
                    `/properties/${id}/images`,
                    formDataImages,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            setSuccess("Property updated successfully!");

            setTimeout(() => {
                navigate("/my-properties");
            }, 800);

        } catch (err) {
            console.error("Error updating property:", err);

            setError(
                err.response?.data?.message ||
                "Failed to update property"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExistingImage = async (imageId, index) => {

    if (!imageId) {
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await api.delete(
            `/properties/${id}/images/${imageId}`
        );

        setExistingImages((prev) =>
            prev.filter((_, i) => i !== index)
        );

    } catch (err) {

        console.error(
            "Error deleting property image:",
            err
        );

        alert(
            err.response?.data?.message ||
            "Failed to delete image"
        );
    }
};

    if (loading) {
        return (
            <div className="edit-property-page">
                <div className="edit-property-container">
                    <p>Loading property...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-property-page">

            <div className="edit-property-container">

                <div className="edit-property-header">
                    <h1>Edit Property</h1>

                    <p>
                        Update your property information and add
                        new photos.
                    </p>
                </div>

                {error && (
                    <div className="edit-property-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="edit-property-success">
                        {success}
                    </div>
                )}

                <form
                    className="edit-property-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label>Property Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="edit-property-row">

                        <div className="form-group">
                            <label>Price Per Night</label>

                            <input
                                type="number"
                                name="pricePerNight"
                                value={formData.pricePerNight}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Maximum Guests</label>

                            <input
                                type="number"
                                name="maxGuests"
                                value={formData.maxGuests}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                    </div>

                    {/* Existing Images */}
                    <div className="form-group">

                        <label>Current Property Images</label>

                        {existingImages.length > 0 ? (

                            <div className="property-image-previews">

                                {existingImages.map(
    (image, index) => (

        <div
            className="property-image-preview"
            key={image.id || image.imageUrl}
        >

            <img
                src={image.imageUrl}
                alt={`Property ${index + 1}`}
            />

            {image.id && (
                <button
                    type="button"
                    className="remove-existing-image-button"
                    onClick={() =>
                        handleDeleteExistingImage(
                            image.id,
                            index
                        )
                    }
                    title="Delete image"
                >
                    ×
                </button>
            )}

        </div>

    )
)}

                            </div>

                        ) : (

                            <p className="no-property-images">
                                No images uploaded yet.
                            </p>

                        )}

                    </div>

                    {/* Add New Images */}
                    <div className="form-group">

                        <label htmlFor="property-images">
                            Add New Images
                        </label>

                        <input
                            id="property-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />

                        <small>
                            You can select multiple images. Maximum
                            5MB per image.
                        </small>

                    </div>

                    {/* New Image Previews */}
                    {imagePreviews.length > 0 && (

                        <div className="form-group">

                            <label>New Images</label>

                            <div className="property-image-previews">

                                {imagePreviews.map(
                                    (preview, index) => (

                                        <div
                                            className="property-image-preview"
                                            key={preview}
                                        >

                                            <img
                                                src={preview}
                                                alt={`New image ${index + 1}`}
                                            />

                                            <button
                                                type="button"
                                                className="remove-image-button"
                                                onClick={() =>
                                                    removeNewImage(index)
                                                }
                                            >
                                                ×
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                    <div className="edit-property-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/my-properties")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-property-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditProperty;