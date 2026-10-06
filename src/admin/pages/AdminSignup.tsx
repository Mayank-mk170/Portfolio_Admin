import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminSignup } from "../services/adminAuthService";

function AdminSignup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setError("");

        // Check password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await adminSignup({
                email,
                password,
            });

            setEmail("");
            setPassword("");
            setConfirmPassword("");

            navigate("/admin/login");

        } catch (error: any) {
            console.error("Account creation failed:", error);

            setError(
                error.response?.data?.message ||
                "Unable to create account"
            );

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
                        ADMIN CMS
                    </div>

                    <h1 className="auth-title">
                        Create
                        <br />
                        Account
                    </h1>

                    <p className="auth-description">
                        Create an administrator account
                        to manage your portfolio content.
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
                            minLength={6}
                            className="admin-input"
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="admin-form-group">

                        <label className="admin-form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Confirm your password"
                            required
                            minLength={6}
                            className="admin-input"
                        />

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    {/* CREATE ACCOUNT */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-button auth-submit"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account →"}
                    </button>


                    {/* SIGN IN */}

                    <div className="auth-footer">

                        <span>
                            Already have an account?
                        </span>

                        <Link
                            to="/admin/login"
                            className="auth-link"
                        >
                            Sign In →
                        </Link>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AdminSignup;