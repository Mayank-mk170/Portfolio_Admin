import { useEffect, useRef, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";

import {
    getUploads,
    uploadFile,
    type Upload,
} from "../services/uploadService";

import { showToast } from "../components/Toast";

const categories = [
    "HERO",
    "CV",
    "PROFILE",
    "PROJECT",
    "BLOG",
    "TESTIMONIAL",
    "SERVICE",
    "OTHER",
];

function AdminUploads() {

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const [file, setFile] =
        useState<File | null>(null);

    const [category, setCategory] =
        useState("PROJECT");

    const [uploads, setUploads] =
        useState<Upload[]>([]);

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // LOAD UPLOADS
    // ==========================================

    const loadUploads = async () => {

        try {

            const data = await getUploads();

            setUploads(data);

        } catch (error) {

            console.error(
                "Failed to load uploads:",
                error
            );

            showToast(
                "Failed to load uploads",
                "error"
            );
        }
    };


    // ==========================================
    // LOAD WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {

        loadUploads();

    }, []);


    // ==========================================
    // FILE SELECT
    // ==========================================

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const selectedFile =
            event.target.files?.[0] || null;

        setFile(selectedFile);
    };


    // ==========================================
    // UPLOAD FILE
    // ==========================================

    const handleUpload = async () => {

    if (!file) {

        showToast(
            "Please select a file",
            "error"
        );

        return;
    }

    try {

        setLoading(true);

        await uploadFile(
            file,
            category
        );

        if (category === "HERO") {

            const latestUploads =
                await getUploads();

            const heroUploads =
                latestUploads.filter(
                    (upload) =>
                        upload.category === "HERO" &&
                        upload.originalFileName === file.name
                );

            const heroUpload =
                heroUploads[heroUploads.length - 1];

            if (!heroUpload) {
                throw new Error(
                    "Hero image uploaded, but its URL could not be found."
                );
            }

            const aboutResponse =
                await api.get("/about");

            const about =
                aboutResponse.data;

            if (!about?.id) {
                throw new Error(
                    "Please create the About section first."
                );
            }

            await api.put(
                `/about/${about.id}`,
                {
                    ...about,
                    heroImage: heroUpload.fileUrl,
                }
            );

            showToast(
                "Hero image uploaded successfully",
                "success"
            );

        } else {

            showToast(
                "File uploaded successfully",
                "success"
            );
        }

        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        await loadUploads();

    } catch (error: any) {

        console.error(
            "File upload failed:",
            error
        );

        const message =
            error?.response?.data?.message ||
            "File upload failed";

        showToast(
            message,
            "error"
        );

    } finally {

        setLoading(false);
    }
};


    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="admin-page-header">

                <div>

                    <span className="admin-label">
                        CMS / FILE MANAGEMENT
                    </span>

                    <h1>
                        Uploads
                    </h1>

                    <p>
                        Upload and manage portfolio assets.
                    </p>

                </div>

            </div>


            {/* ==================================
                UPLOAD FORM
            ================================== */}

            <section className="upload-form">

                <div className="form-group">

                    <label>
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(
                                event.target.value
                            )
                        }
                    >

                        {categories.map((item) => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        ))}

                    </select>

                    {category === "HERO" && (
                        <p className="hero-upload-hint">
                            This image will be displayed on the right side
                            of the public Hero section.
                        </p>
                    )}

                </div>


                <div className="form-group">

                    <label>
                        File
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={
                            category === "HERO"
                                ? "image/*"
                                : "image/*,.pdf"
                        }
                        onChange={handleFileChange}
                    />

                </div>


                {file && (

                    <div className="selected-file">

                        <strong>
                            Selected:
                        </strong>{" "}

                        {file.name}

                    </div>

                )}


                <button
                    type="button"
                    className="upload-button"
                    onClick={handleUpload}
                    disabled={loading}
                >

                    {loading
                        ? "Uploading..."
                        : "Upload File"}

                </button>

            </section>


            {/* ==================================
                UPLOAD LIST
            ================================== */}

            <section className="uploads-section">

                <div className="section-heading">

                    <span>

                        {uploads.length} FILE
                        {uploads.length !== 1
                            ? "S"
                            : ""}

                    </span>

                </div>


                {uploads.length === 0 ? (

                    <div className="empty-state">

                        No files uploaded yet.

                    </div>

                ) : (

                    <div className="uploads-table">

                        {/* TABLE HEADER */}

                        <div className="uploads-table-header">

                            <span>
                                FILE
                            </span>

                            <span>
                                CATEGORY
                            </span>

                            <span>
                                TYPE
                            </span>

                            <span>
                                SIZE
                            </span>

                            <span>
                                ACTION
                            </span>

                        </div>


                        {/* FILE ROWS */}

                        {uploads.map((upload) => (

                            <div
                                className="uploads-row"
                                key={upload.id}
                            >

                                {/* FILE */}

                                <div className="upload-file-name">

                                    {upload.contentType.startsWith(
                                        "image/"
                                    ) ? (

                                        <img
                                            src={
                                                upload.fileUrl
                                            }
                                            alt={
                                                upload.originalFileName
                                            }
                                        />

                                    ) : (

                                        <div className="file-icon">
                                            PDF
                                        </div>

                                    )}

                                    <span>
                                        {
                                            upload.originalFileName
                                        }
                                    </span>

                                </div>


                                {/* CATEGORY */}

                                <span>
                                    {upload.category}
                                </span>


                                {/* TYPE */}

                                <span>
                                    {upload.contentType}
                                </span>


                                {/* SIZE */}

                                <span>

                                    {(
                                        upload.fileSize /
                                        1024
                                    ).toFixed(1)}{" "}

                                    KB

                                </span>


                                {/* OPEN */}

                                <a
                                    href={
                                        upload.fileUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="upload-open"
                                >
                                    Open
                                </a>

                            </div>

                        ))}

                    </div>

                )}

            </section>

                </div>

            </main>

        </div>
    );
}

export default AdminUploads;