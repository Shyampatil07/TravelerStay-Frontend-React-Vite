import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {

    e.preventDefault();

    setError("");

    // Password validation
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    // Profile photo validation
    if (
        profilePhoto &&
        !profilePhoto.type.startsWith("image/")
    ) {
        setError("Please select a valid image file.");
        return;
    }

    if (
        profilePhoto &&
        profilePhoto.size > 5 * 1024 * 1024
    ) {
        setError("Profile photo must be less than 5MB.");
        return;
    }

    try {

        setLoading(true);

        // --------------------------------
        // 1. REGISTER USER
        // --------------------------------

        const response = await api.post(
            "/auth/register",
            {
                name,
                email,
                phone,
                about,
                password
            }
        );

        console.log(
            "REGISTER RESPONSE:",
            response.data
        );

        // --------------------------------
        // 2. GET JWT TOKEN
        // --------------------------------

        const token =
            response.data?.data?.token;

        if (!token) {
            throw new Error(
                "Registration successful, but token was not received."
            );
        }

        // --------------------------------
        // 3. SAVE TOKEN
        // --------------------------------

        localStorage.setItem(
            "token",
            token
        );

        // --------------------------------
        // 4. UPLOAD PROFILE PHOTO
        // --------------------------------

        if (profilePhoto) {

            const formData = new FormData();

            formData.append(
                "file",
                profilePhoto
            );

            const photoResponse =
                await api.post(
                    "/hosts/profile/photo",
                    formData
                );

            console.log(
                "PROFILE PHOTO RESPONSE:",
                photoResponse.data
            );
        }

        // --------------------------------
        // 5. REGISTRATION COMPLETE
        // --------------------------------

        navigate("/");

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error.response?.data ||
            error.message
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Unable to create account."
        );

    } finally {

        setLoading(false);
    }
};

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Join Wanderlust and discover your next stay.
                    </p>

                </div>


                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleRegister}>

                    <div className="auth-form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="auth-form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="auth-form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                        />

                    </div>

                    <div className="auth-form-group">

    <label>
        About
    </label>

    <textarea
        placeholder="Tell us a little about yourself"
        value={about}
        onChange={(e) =>
            setAbout(e.target.value)
        }
        rows="3"
    />

</div>

<div className="auth-form-group">

    <label>
        Profile Photo
    </label>

    <input
        type="file"
        accept="image/*"
        onChange={(e) =>
            setProfilePhoto(
                e.target.files?.[0] || null
            )
        }
    />

    {profilePhoto && (
        <small>
            Selected: {profilePhoto.name}
        </small>
    )}

    <small>
        JPG, PNG or other image format. Max 5MB.
    </small>

</div>


                    <div className="auth-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="auth-form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"
                        }
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Already have an account?
                        {" "}

                        <Link to="/login">
                            Log in
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;