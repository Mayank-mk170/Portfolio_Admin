import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";
import AssetPicker from "../components/AssetPicker";
import { showToast } from "../services/toast";

interface About {
    id?: number;
    heading: string;
    description: string;
    shortDescription: string;
    profileImage: string;
    resumeUrl: string;

    // Hero Content
    heroEyebrow: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroTitleLine3: string;
    heroDescription: string;
}

const emptyAbout: About = {
    heading: "",
    description: "",
    shortDescription: "",
    profileImage: "",
    resumeUrl: "",

    // Hero Content
    heroEyebrow: "",
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroTitleLine3: "",
    heroDescription: "",
};

function AdminAbout() {

    const [about, setAbout] =
        useState<About>(emptyAbout);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    /* =====================================================
       LOAD ABOUT
       ===================================================== */

    useEffect(() => {
        loadAbout();
    }, []);


    const loadAbout = async () => {

        try {

            const response =
                await api.get("/about");

            setAbout(response.data);

        } catch (error: any) {

            if (error.response?.status === 404) {

                setAbout(emptyAbout);

            } else {

                console.error(
                    "Unable to load About section:",
                    error
                );

                showToast(
                    "Unable to load About section",
                    "error"
                );
            }

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       INPUT CHANGE
       ===================================================== */

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const {
            name,
            value,
        } = event.target;

        setAbout((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    /* =====================================================
       SAVE / UPDATE
       ===================================================== */

    const handleSave = async (
        section: "hero" | "about"
    ) => {

        try {

            setSaving(true);

            if (about.id) {

                const response =
                    await api.put(
                        `/about/${about.id}`,
                        about
                    );

                setAbout(response.data);

                showToast(
                    section === "hero"
                        ? "Hero updated successfully"
                        : "About updated successfully",
                    "success"
                );

            } else {

                const response =
                    await api.post(
                        "/about",
                        about
                    );

                setAbout(response.data);

                showToast(
                    section === "hero"
                        ? "Hero created successfully"
                        : "About created successfully",
                    "success"
                );
            }

        } catch (error: any) {

            console.error(
                `${section} request failed:`,
                error
            );

            showToast(
                error.response?.data?.message ||
                    `Unable to save ${section === "hero" ? "Hero" : "About"} section`,
                "error"
            );

        } finally {

            setSaving(false);
        }
    };


    /* =====================================================
       DELETE
       ===================================================== */

    const handleDelete = async () => {

        if (!about.id) {
            return;
        }

        try {

            await api.delete(
                `/about/${about.id}`
            );

            setAbout(emptyAbout);

            showToast(
                "About deleted successfully",
                "success"
            );

        } catch (error: any) {

            console.error(
                "About delete failed:",
                error
            );

            showToast(
                error.response?.data?.message ||
                    "Unable to delete About section",
                "error"
            );
        }
    };


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {

        return (

            <div className="admin-background">

                <AdminSidebar />

                <main className="admin-main">

                    <div className="admin-content">

                        <p className="admin-page-description">
                            Loading About...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    /* =====================================================
       PAGE
       ===================================================== */

    return (

        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">


                    {/* =================================================
                        PAGE HEADER
                        ================================================= */}

                    <header className="admin-page-header">

                        <div className="admin-page-label">

                            <span>
                                CMS / 01
                            </span>

                        </div>

                        <h1 className="admin-page-title">
                            About
                        </h1>

                        <p className="admin-page-description">
                            Manage the introduction and personal
                            information displayed on your portfolio.
                        </p>

                    </header>


                    {/* =================================================
                        FORM
                        ================================================= */}

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSave("about");
                        }}
                        className="admin-form"
                    >


                        {/* =================================================
                            HERO CONTENT
                            ================================================= */}

                        <div className="admin-form-section">

                            <div className="admin-form-section-header">
                                <span>Title</span>
                            </div>

                            <div className="admin-form-group">

                                <input
                                    type="text"
                                    name="heroEyebrow"
                                    value={about.heroEyebrow}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="Mayank Kumar / Java Full Stack Developer"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Title Line 1
                                </label>

                                <input
                                    type="text"
                                    name="heroTitleLine1"
                                    value={about.heroTitleLine1}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="I build"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Title Line 2
                                </label>

                                <input
                                    type="text"
                                    name="heroTitleLine2"
                                    value={about.heroTitleLine2}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="scalable"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Title Line 3
                                </label>

                                <input
                                    type="text"
                                    name="heroTitleLine3"
                                    value={about.heroTitleLine3}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="digital experiences."
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Hero Description
                                </label>

                                <textarea
                                    name="heroDescription"
                                    value={about.heroDescription}
                                    onChange={handleChange}
                                    rows={5}
                                    className="admin-textarea"
                                    placeholder="I am a Java Full Stack Developer specializing in Spring Boot, React, REST APIs and database development."
                                />

                            </div>

                            <div className="admin-actions">
                                <button
                                    type="button"
                                    onClick={() => handleSave("hero")}
                                    disabled={saving}
                                    className="admin-button"
                                >
                                    {saving
                                        ? "Updating Hero..."
                                        : about.id
                                            ? "Update Hero"
                                            : "Save Hero"}
                                </button>
                            </div>

                        </div>


                        {/* =================================================
                            ABOUT CONTENT
                            ================================================= */}

                        <div className="admin-form-section-header">
                            <span>ABOUT</span>
                        </div>


                        {/* =================================================
                            HEADING
                            ================================================= */}

                        <div className="admin-form-group">

                           

                            <input
                                type="text"
                                name="heading"
                                value={about.heading}
                                onChange={handleChange}
                                required
                                className="admin-input"
                                placeholder="About Me"
                            />

                        </div>


                        {/* =================================================
                            SHORT DESCRIPTION
                            ================================================= */}

                        <div className="admin-form-group">

                            <label className="admin-form-label">
                                Short Description
                            </label>

                            <textarea
                                name="shortDescription"
                                value={
                                    about.shortDescription
                                }
                                onChange={handleChange}
                                rows={3}
                                className="admin-textarea"
                                placeholder="Java Full Stack Developer"
                            />

                        </div>


                        {/* =================================================
                            DESCRIPTION
                            ================================================= */}

                        <div className="admin-form-group">

                            <label className="admin-form-label">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={about.description}
                                onChange={handleChange}
                                required
                                rows={8}
                                className="admin-textarea"
                                placeholder="Write your portfolio introduction..."
                            />

                        </div>


                        {/* =================================================
                            PROFILE IMAGE
                            ================================================= */}

                        <div className="admin-form-group">

                            <AssetPicker
                                category="PROFILE"
                                value={about.profileImage}
                                onSelect={(url) =>
                                    setAbout(
                                        (previous) => ({
                                            ...previous,
                                            profileImage: url,
                                        })
                                    )
                                }
                                label="Profile Image"
                            />

                        </div>


                        {/* =================================================
                            CV / RESUME
                            ================================================= */}

                        <div className="admin-form-group">

                            <AssetPicker
                                category="CV"
                                value={about.resumeUrl}
                                onSelect={(url) =>
                                    setAbout(
                                        (previous) => ({
                                            ...previous,
                                            resumeUrl: url,
                                        })
                                    )
                                }
                                label="CV / Resume"
                            />

                        </div>


                        {/* =================================================
                            ACTIONS
                            ================================================= */}

                        <div className="admin-actions">

                            <button
                                type="submit"
                                disabled={saving}
                                className="admin-button"
                            >

                                {saving
                                    ? "Updating About..."
                                    : about.id
                                        ? "Update About"
                                        : "Save About"}

                            </button>


                            {about.id && (

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={saving}
                                    className="admin-button admin-button-danger"
                                >
                                    Delete
                                </button>

                            )}

                        </div>

                    </form>

                </div>

            </main>

        </div>

        
    );
}

export default AdminAbout;