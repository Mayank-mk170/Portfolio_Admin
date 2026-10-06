import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

import {
    getUserProfile,
    saveUserProfile,
} from "../services/userProfileService";

import { showToast } from "../components/Toast";

function AdminUser() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [education, setEducation] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // ==========================================
    // LOAD USER PROFILE
    // ==========================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                const profile = await getUserProfile();

                if (profile) {

                    setName(profile.name || "");
                    setEmail(profile.email || "");
                    setEducation(profile.education || "");
                }

            } catch (error) {

                console.error(
                    "Failed to load user profile:",
                    error
                );

                showToast(
                    "Unable to load user profile",
                    "error"
                );

            } finally {

                setLoading(false);
            }
        };

        loadProfile();

    }, []);


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!name.trim()) {

            showToast(
                "Name is required",
                "error"
            );

            return;
        }

        try {

            setSaving(true);

            await saveUserProfile({
                name: name.trim(),
                email: email.trim(),
                education: education.trim(),
            });

            showToast(
                "User profile updated successfully",
                "success"
            );

        } catch (error: any) {

            console.error(
                "Save user profile error:",
                error
            );

            showToast(
                error.response?.data?.message ||
                "Unable to save user profile",
                "error"
            );

        } finally {

            setSaving(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-background">

                <AdminSidebar />

                <main className="admin-main">

                    <div className="admin-content">

                        <div className="admin-page">

                            <p>Loading user profile...</p>

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">

                    <div className="admin-page">

                        <div className="admin-page-header">

                            <div>

                                <p className="admin-eyebrow">
                                    CMS
                                </p>

                                <h1 className="admin-page-title">
                                    User Profile
                                </h1>

                                <p className="admin-page-description">
                                    Manage the personal information
                                    displayed on your portfolio.
                                </p>

                            </div>

                        </div>


                        <form
                            className="admin-form"
                            onSubmit={handleSave}
                        >

                            {/* NAME */}

                            <div className="admin-form-group">

                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your name"
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="admin-form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter your email"
                                />

                            </div>


                            {/* EDUCATION */}

                            <div className="admin-form-group">

                                <label htmlFor="education">
                                    Education
                                </label>

                                <input
                                    id="education"
                                    type="text"
                                    value={education}
                                    onChange={(event) =>
                                        setEducation(event.target.value)
                                    }
                                    placeholder="Enter your education"
                                />

                            </div>


                            {/* SAVE */}

                            <div className="admin-form-actions">

                                <button
                                    type="submit"
                                    className="admin-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Profile"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminUser;