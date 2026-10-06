import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function Navbar() {

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(
        JSON.parse(
            localStorage.getItem("user") || "null"
        )
    );

    


    useEffect(() => {

        const handleAuthChange = () => {

            setToken(
                localStorage.getItem("token")
            );

            setUser(
                JSON.parse(
                    localStorage.getItem("user") || "null"
                )
            );
        };

        window.addEventListener(
            "auth-change",
            handleAuthChange
        );

        return () => {

            window.removeEventListener(
                "auth-change",
                handleAuthChange
            );

        };

    }, []);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Update Navbar immediately
        window.dispatchEvent(
            new Event("auth-change")
        );

        navigate("/");
    };

    const closeMenu = () => {
    setMenuOpen(false);
};


    return (

        
<nav className="navbar">

    {/* LEFT SIDE - NAVIGATION
    <div className="nav-links">

        <NavLink
            to="/"
            end
            className={({ isActive }) =>
                isActive
                    ? "navbar-link active"
                    : "navbar-link"
            }
        >
            Explore
        </NavLink>

        <NavLink
            to="/properties"
            className={({ isActive }) =>
                isActive
                    ? "navbar-link active"
                    : "navbar-link"
            }
        >
            Stays
        </NavLink>

        {token ? (
            <>
                <NavLink
                    to="/create-property"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Become a Host
                </NavLink>

                <NavLink
                    to="/my-properties"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    My Properties
                </NavLink>

                <NavLink
                    to="/host-bookings"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Host Bookings
                </NavLink>

                <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    My Bookings
                </NavLink>

                <span className="nav-user">
                    Hi, {user?.name}
                </span>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </>
        ) : (
            <>
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Login
                </NavLink>

                <NavLink
                    to="/register"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                >
                    Sign Up
                </NavLink>
            </>
        )}

    </div> */}


    {/* RIGHT SIDE - BRAND */}
    <Link
        to="/"
        className="logo"
    >
        Wanderlust
    </Link>

    {/* MOBILE MENU BUTTON */}
    <button
        type="button"
        className="mobile-menu-button"
        onClick={() =>
            setMenuOpen((previous) => !previous)
        }
        aria-label="Toggle navigation menu"
    >
        {menuOpen ? "✕" : "☰"}
    </button>

     {/* NAVIGATION */}
    <div
        className={`nav-links ${
            menuOpen ? "mobile-menu-open" : ""
        }`}
    >

        <NavLink
            to="/"
            end
            className={({ isActive }) =>
                isActive
                    ? "navbar-link active"
                    : "navbar-link"
            }
            onClick={closeMenu}
        >
            Explore
        </NavLink>

        <NavLink
            to="/properties"
            className={({ isActive }) =>
                isActive
                    ? "navbar-link active"
                    : "navbar-link"
            }
            onClick={closeMenu}
        >
            Stays
        </NavLink>


        {token ? (

            <>
                <NavLink
                    to="/create-property"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                    onClick={closeMenu}
                >
                    Become a Host
                </NavLink>

                <NavLink
                    to="/my-properties"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                    onClick={closeMenu}
                >
                    My Properties
                </NavLink>

                <NavLink
                    to="/host-bookings"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                    onClick={closeMenu}
                >
                    Host Bookings
                </NavLink>

                <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                    onClick={closeMenu}
                >
                    My Bookings
                </NavLink>

                <span className="nav-user">
                    Hi, {user?.name}
                </span>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </>

        ) : (

            <>
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                    onClick={closeMenu}
                >
                    Login
                </NavLink>

                <NavLink
                    to="/register"
                    className={({ isActive }) =>
                        isActive
                            ? "navbar-link active"
                            : "navbar-link"
                    }
                    onClick={closeMenu}
                >
                    Sign Up
                </NavLink>
            </>

        )}

    </div>

</nav>
    );
}

export default Navbar;