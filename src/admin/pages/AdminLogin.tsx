import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    adminLogin,
    saveToken,
} from "../services/adminAuthService";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            setLoading(true);

            const response = await adminLogin({
                email,
                password,
            });

            saveToken(response.token);

            navigate("/admin");

        } catch (error) {

            console.error("Login failed:", error);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* HEADER */}

                <div className="auth-header">

                    <div className="auth-label">
                        ADMIN CMS / 01
                    </div>

                    <h1 className="auth-title">
                        Welcome
                        <br />
                        Back.
                    </h1>

                    <p className="auth-description">
                        Sign in to manage your personal
                        portfolio website.
                    </p>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="admin-form auth-form"
                >

                    {/* EMAIL */}

                    <div className="admin-form-group">

                        <label className="admin-form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="admin@example.com"
                            required
                            className="admin-input"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="admin-form-group">

                        <label className="admin-form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            className="admin-input"
                        />

                    </div>





                    {/* SIGN IN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-button auth-submit"
                    >
                        {loading
                            ? "Signing In..."
                            : "Sign In →"}
                    </button>
                    {/* FORGOT PASSWORD */}

                    <div className="auth-forgot">

                        <Link
                            to="/admin/forgot-password"
                            className="auth-link"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    {/* CREATE ACCOUNT */}

                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link
                            to="/admin/signup"
                            className="auth-link"
                        >
                            Create Account →
                        </Link>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;