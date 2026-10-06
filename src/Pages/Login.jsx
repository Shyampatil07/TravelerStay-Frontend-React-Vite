import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            /*
             * Backend AuthResponse:
             * id, name, email, role, token
             */

            const authData = response.data.data;

            // Save JWT
        localStorage.setItem(
            "token",
            authData.token
        );
        
        // Save user information
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: authData.id,
                name: authData.name,
                email: authData.email,
                role: authData.role
            })
        );
        
        // Tell Navbar that authentication changed
        window.dispatchEvent(new Event("auth-change"));
        
        // Redirect
        const redirectTo =
            location.state?.from || "/";
        
        navigate(redirectTo);
        
        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
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
                        Welcome back
                    </h1>

                    <p>
                        Log in to continue your Wanderlust journey.
                    </p>

                </div>


                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleLogin}>

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
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
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
                            ? "Logging in..."
                            : "Log In"
                        }
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Don't have an account?
                        {" "}

                        <Link to="/register">
                            Sign up
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;