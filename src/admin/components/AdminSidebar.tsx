import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/adminAuthService";

function AdminSidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <aside className="admin-sidebar">

            {/* ========================================
                BRAND
            ======================================== */}

            <div className="admin-brand">

                <h1 className="admin-brand-title">
                    Portfolio CMS
                </h1>

                <p className="admin-brand-subtitle">
                    Admin Panel
                </p>

            </div>


            {/* ========================================
                NAVIGATION
            ======================================== */}

            <nav className="admin-navigation">

                <Link
                    to="/admin"
                    className={
                        isActive("/admin")
                            ? "active"
                            : ""
                    }
                >
                    Dashboard
                </Link>

                <Link
                    to="/admin/user"
                    className={
                        isActive("/admin/user")
                            ? "active"
                            : ""
                    }
                >
                    User
                </Link>

                <Link
                    to="/admin/about"
                    className={
                        isActive("/admin/about")
                            ? "active"
                            : ""
                    }
                >
                    About
                </Link>


                <Link
                    to="/admin/skills"
                    className={
                        isActive("/admin/skills")
                            ? "active"
                            : ""
                    }
                >
                    Skills
                </Link>


                <Link
                    to="/admin/projects"
                    className={
                        isActive("/admin/projects")
                            ? "active"
                            : ""
                    }
                >
                    Projects
                </Link>


                <Link
                    to="/admin/blogs"
                    className={
                        isActive("/admin/blogs")
                            ? "active"
                            : ""
                    }
                >
                    Blogs
                </Link>


                <Link
                    to="/admin/experience"
                    className={
                        isActive("/admin/experience")
                            ? "active"
                            : ""
                    }
                >
                    Experience
                </Link>


                <Link
                    to="/admin/services"
                    className={
                        isActive("/admin/services")
                            ? "active"
                            : ""
                    }
                >
                    Services
                </Link>


                <Link
                    to="/admin/testimonials"
                    className={
                        isActive("/admin/testimonials")
                            ? "active"
                            : ""
                    }
                >
                    Testimonials
                </Link>


                {/* MESSAGES */}

                <Link
                    to="/admin/messages"
                    className={
                        isActive("/admin/messages")
                            ? "active"
                            : ""
                    }
                >
                    Messages
                </Link>


                {/* UPLOADS */}

                <Link
                    to="/admin/uploads"
                    className={
                        isActive("/admin/uploads")
                            ? "active"
                            : ""
                    }
                >
                    Uploads
                </Link>

            </nav>


            {/* ========================================
                LOGOUT
            ======================================== */}

            <div className="admin-logout-wrapper">

                <button
                    onClick={handleLogout}
                    className="admin-logout"
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default AdminSidebar;