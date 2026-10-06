import { Link } from "react-router-dom";
import "./Footer.css";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="site-footer">

            <div className="site-footer-container">

                {/* TOP FOOTER */}

                <div className="site-footer-main">

                    {/* SUPPORT */}

                    <div className="footer-column">

                        <h3>Support</h3>

                        <Link to="/help">
                            Help Center
                        </Link>

                        <Link to="/contact">
                            Contact Us
                        </Link>

                        <Link to="/cancellation">
                            Cancellation
                        </Link>

                        <Link to="/safety">
                            Safety
                        </Link>

                    </div>


                    {/* HOSTING */}

                    <div className="footer-column">

                        <h3>Hosting</h3>

                        <Link to="/become-host">
                            Become a Host
                        </Link>

                        <Link to="/host-resources">
                            Host Resources
                        </Link>

                        <Link to="/host-guidelines">
                            Host Guidelines
                        </Link>

                        <Link to="/responsible-hosting">
                            Responsible Hosting
                        </Link>

                    </div>


                    {/* WANDERLUST */}

                    <div className="footer-column">

                        <h3>Wanderlust</h3>

                        <Link to="/about">
                            About
                        </Link>

                        <Link to="/careers">
                            Careers
                        </Link>

                        <Link to="/blog">
                            Blog
                        </Link>

                        <Link to="/press">
                            Press
                        </Link>

                    </div>

                </div>


                {/* BOTTOM FOOTER */}

                <div className="site-footer-bottom">

                    <div className="footer-bottom-left">

                        <span>
                            © 2026 Wanderlust
                        </span>

                        <Link to="/privacy">
                            Privacy
                        </Link>

                        <Link to="/terms">
                            Terms
                        </Link>

                        <Link to="/sitemap">
                            Sitemap
                        </Link>

                        <Link to="/accessibility">
                            Accessibility
                        </Link>

                    </div>


                    <div className="footer-bottom-right">

                        <span className="footer-language">
                            🌐 English (IN)
                        </span>

                        <a
                            href="mailto:support@wanderlust.com"
                            className="footer-email"
                        >
                            support@wanderlust.com
                        </a>

                        <div className="footer-social">

    <a
        href="https://www.facebook.com/shyam.lade.77/"
        aria-label="Facebook"
        title="Facebook"
    >
        <FaFacebookF />
    </a>

    <a
        href="https://www.instagram.com/shyam_lade_patil_07/"
        aria-label="Instagram"
        title="Instagram"
    >
        <FaInstagram />
    </a>

    <a
        href="https://github.com/Shyampatil07"
        aria-label="Twitter"
        title="Twitter"
    >
        <FaTwitter />
    </a>

</div>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;