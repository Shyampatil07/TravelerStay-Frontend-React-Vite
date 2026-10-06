import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateProperty() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [maxGuests, setMaxGuests] = useState("");

    // Multiple images
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // IMAGE SELECTION
    // ==========================================

    const handleImageChange = (e) => {

        const selectedFiles =
            Array.from(e.target.files || []);

        if (selectedFiles.length === 0) {
            return;
        }

        setError("");

        // Validate images
        for (const file of selectedFiles) {

            if (!file.type.startsWith("image/")) {
                setError(
                    `${file.name} is not a valid image file.`
                );
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(
                    `${file.name} is larger than 5MB.`
                );
                return;
            }
        }

        // Store files
        setImages(selectedFiles);

        // Create previews
        const previewUrls = selectedFiles.map(
            (file) => URL.createObjectURL(file)
        );

        setImagePreviews(previewUrls);
    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login", {
                state: {
                    from: "/create-property"
                }
            });

            return;
        }

        try {

            setLoading(true);

            // ==========================================
            // STEP 1: CREATE PROPERTY
            // ==========================================

            const propertyData = {

                title: title.trim(),

                description:
                    description.trim(),

                location:
                    location.trim(),

                pricePerNight:
                    Number(pricePerNight),

                maxGuests:
                    Number(maxGuests)
            };


            console.log(
                "CREATE PROPERTY REQUEST:",
                propertyData
            );


            const response =
                await api.post(
                    "/properties",
                    propertyData
                );


            console.log(
                "PROPERTY CREATED:",
                response.data
            );


            const createdProperty =
                response.data.data;


            // ==========================================
            // STEP 2: UPLOAD MULTIPLE IMAGES
            // ==========================================

            if (images.length > 0) {

                const formData =
                    new FormData();


                images.forEach((image) => {

                    formData.append(
                        "files",
                        image
                    );

                });


                console.log(
                    "UPLOADING PROPERTY IMAGES:",
                    images.length
                );


                const imageResponse =
                    await api.post(
                        `/properties/${createdProperty.id}/images`,
                        formData
                    );


                console.log(
                    "IMAGE UPLOAD RESPONSE:",
                    imageResponse.data
                );
            }


            // ==========================================
            // STEP 3: GO TO PROPERTY
            // ==========================================

            navigate(
                `/properties/${createdProperty.id}`
            );

        } catch (error) {

            console.error(
                "CREATE PROPERTY ERROR:",
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.message ||
                "Unable to create property."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="create-property-page">

            <div className="create-property-container">

                <div className="create-property-header">

                    <h1>
                        Become a Host
                    </h1>

                    <p>
                        Share your place with travelers
                        on Wanderlust.
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="property-form-error">

                        {error}

                    </div>

                )}


                <form
                    className="property-form"
                    onSubmit={handleSubmit}
                >

                    {/* ==================================
                        TITLE
                    ================================== */}

                    <div className="property-form-group">

                        <label>
                            Property title
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Beautiful Villa in Pune"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <div className="property-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            rows="5"
                            placeholder="Tell guests about your property..."
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* ==================================
                        LOCATION
                    ================================== */}

                    <div className="property-form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Pune, Maharashtra"
                            value={location}
                            onChange={(e) =>
                                setLocation(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* ==================================
                        PRICE + GUESTS
                    ================================== */}

                    <div className="property-form-row">

                        <div className="property-form-group">

                            <label>
                                Price per night
                            </label>

                            <div className="price-input">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="2500"
                                    value={pricePerNight}
                                    onChange={(e) =>
                                        setPricePerNight(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="property-form-group">

                            <label>
                                Maximum guests
                            </label>

                            <input
                                type="number"
                                min="1"
                                placeholder="4"
                                value={maxGuests}
                                onChange={(e) =>
                                    setMaxGuests(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* ==================================
                        MULTIPLE IMAGES
                    ================================== */}

                    <div className="property-form-group">

                        <label>
                            Property images
                        </label>


                        <div className="image-upload-box">

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={
                                    handleImageChange
                                }
                            />


                            <p>
                                Select multiple images
                                of your property.
                            </p>

                        </div>


                        <small>
                            You can select multiple images.
                            Each image must be less than 5MB.
                        </small>


                        {/* IMAGE PREVIEWS */}

                        {imagePreviews.length > 0 && (

                            <div className="property-image-previews">

                                {imagePreviews.map(
                                    (preview, index) => (

                                        <div
                                            className="property-image-preview"
                                            key={preview}
                                        >

                                            <img
                                                src={preview}
                                                alt={`Property preview ${index + 1}`}
                                            />

                                            <span>
                                                {index === 0
                                                    ? "Main Image"
                                                    : `Image ${index + 1}`}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* ==================================
                        SUBMIT
                    ================================== */}

                    <button
                        type="submit"
                        className="create-property-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating property..."
                            : "Create Property"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default CreateProperty;