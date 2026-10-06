import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";
import { showToast } from "../services/toast";

import AssetPicker from "../components/AssetPicker";

interface Project {
    id?: number;
    title: string;
    description: string;
    imageUrl: string;
    githubUrl: string;
    liveUrl: string;
    technologies: string;
    featured: boolean;
    displayOrder: number;
}

const emptyProject: Project = {
    title: "",
    description: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    technologies: "",
    featured: false,
    displayOrder: 0,
};

function AdminProjects() {

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [project, setProject] =
        useState<Project>(emptyProject);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [showForm, setShowForm] =
        useState(false);

    // Multiple project images.
    // They are stored in the existing imageUrl field as comma-separated URLs,
    // so no database change is required for this admin update.
    const [projectImages, setProjectImages] =
        useState<string[]>([""]);


    useEffect(() => {
        loadProjects();
    }, []);


    const loadProjects = async () => {

        try {

            const response =
                await api.get("/projects");

            setProjects(response.data);

        } catch (error) {

            console.error(error);

            showToast(
                "Unable to load projects",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };


    const parseProjectImages = (imageUrl?: string): string[] => {
        if (!imageUrl) {
            return [""];
        }

        const images = imageUrl
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean);

        return images.length > 0
            ? images
            : [""];
    };


    const handleChange = (
        event:
            React.ChangeEvent<
                HTMLInputElement |
                HTMLTextAreaElement
            >
    ) => {

        const {
            name,
            value,
            type,
        } = event.target;

        if (type === "checkbox") {

            const checked =
                (event.target as HTMLInputElement)
                    .checked;

            setProject((previous) => ({
                ...previous,
                [name]: checked,
            }));

            return;
        }

        setProject((previous) => ({
            ...previous,

            [name]:
                name === "displayOrder"
                    ? Number(value)
                    : value,
        }));
    };


    const handleAdd = () => {

        setProject(emptyProject);

        setProjectImages([""]);

        setEditingId(null);

        setShowForm(true);
    };


    const handleEdit = (
        selectedProject: Project
    ) => {

        setProject({
            id: selectedProject.id,
            title: selectedProject.title,
            description:
                selectedProject.description || "",
            imageUrl:
                selectedProject.imageUrl || "",
            githubUrl:
                selectedProject.githubUrl || "",
            liveUrl:
                selectedProject.liveUrl || "",
            technologies:
                selectedProject.technologies || "",
            featured:
                selectedProject.featured || false,
            displayOrder:
                selectedProject.displayOrder || 0,
        });

        setProjectImages(
            parseProjectImages(selectedProject.imageUrl)
        );

        setEditingId(
            selectedProject.id ?? null
        );

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleCancel = () => {

        setProject(emptyProject);

        setProjectImages([""]);

        setEditingId(null);

        setShowForm(false);
    };


    const handleSave = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            setSaving(true);

            const projectPayload = {
                ...project,
                imageUrl: projectImages
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .join(","),
            };

            if (editingId) {

                await api.put(
                    `/projects/${editingId}`,
                    projectPayload
                );

                showToast(
                    "Project updated successfully",
                    "success"
                );

            } else {

                await api.post(
                    "/projects",
                    projectPayload
                );

                showToast(
                    "Project added successfully",
                    "success"
                );
            }

            setProject(emptyProject);

            setProjectImages([""]);

            setEditingId(null);

            setShowForm(false);

            await loadProjects();

        } catch (error: any) {

            showToast(
                error.response?.data?.message ||
                "Unable to save project",
                "error"
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDelete = async (
        id?: number
    ) => {

        if (!id) {
            return;
        }

        try {

            await api.delete(
                `/projects/${id}`
            );

            setProjects((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== id
                )
            );

            showToast(
                "Project deleted successfully",
                "success"
            );

        } catch (error: any) {

            showToast(
                error.response?.data?.message ||
                "Unable to delete project",
                "error"
            );
        }
    };


    return (
        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">

                    {/* HEADER */}

                    <header className="skills-page-header">

                        <div>

                            <div className="admin-page-label">

                                <span>
                                    CMS / 02
                                </span>

                            </div>

                            <h1 className="admin-page-title">
                                Projects
                            </h1>

                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="skills-add-button"
                        >
                            + Add Project
                        </button>

                    </header>


                    {/* FORM */}

                    {showForm && (

                        <form
                            onSubmit={handleSave}
                            className="skill-form"
                        >

                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Project Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={project.title}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="CloudDrive"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={project.description}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="Describe your project"
                                    rows={5}
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Project Images
                                </label>

                                <div className="project-images-list">

                                    {projectImages.map(
                                        (imageUrl, index) => (

                                            <div
                                                className="project-image-item"
                                                key={index}
                                            >

                                                <AssetPicker
                                                    category="PROJECT"
                                                    value={imageUrl}
                                                    onSelect={(url) => {
                                                        setProjectImages(
                                                            (previous) =>
                                                                previous.map(
                                                                    (
                                                                        currentUrl,
                                                                        currentIndex
                                                                    ) =>
                                                                        currentIndex === index
                                                                            ? url
                                                                            : currentUrl
                                                                )
                                                        );
                                                    }}
                                                    label={`Project Image ${index + 1}`}
                                                />

                                                <button
                                                    type="button"
                                                    className="project-image-remove"
                                                    onClick={() => {
                                                        setProjectImages(
                                                            (previous) => {
                                                                if (
                                                                    previous.length ===
                                                                    1
                                                                ) {
                                                                    return [""];
                                                                }

                                                                return previous.filter(
                                                                    (
                                                                        _,
                                                                        currentIndex
                                                                    ) =>
                                                                        currentIndex !==
                                                                        index
                                                                );
                                                            }
                                                        );
                                                    }}
                                                >
                                                    Remove Picture
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                                <button
                                    type="button"
                                    className="project-image-add"
                                    onClick={() =>
                                        setProjectImages(
                                            (previous) => [
                                                ...previous,
                                                "",
                                            ]
                                        )
                                    }
                                >
                                    + Add Another Picture
                                </button>

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    GitHub URL
                                </label>

                                <input
                                    type="text"
                                    name="githubUrl"
                                    value={project.githubUrl}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="https://github.com/username/project"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Live URL
                                </label>

                                <input
                                    type="text"
                                    name="liveUrl"
                                    value={project.liveUrl}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="https://example.com"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Technologies
                                </label>

                                <input
                                    type="text"
                                    name="technologies"
                                    value={project.technologies}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="Java, Spring Boot, React, PostgreSQL"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="experience-checkbox">

                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={project.featured}
                                        onChange={handleChange}
                                    />

                                    Featured Project

                                </label>

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={project.displayOrder}
                                    onChange={handleChange}
                                    min="0"
                                    className="admin-input"
                                />

                            </div>


                            <div className="admin-actions">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="admin-button"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Project"
                                            : "Add Project"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="admin-button"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}


                    {/* PROJECTS TABLE */}

                    <div className="skills-table-container">

                        {loading ? (

                            <div className="skills-empty">

                                <p>
                                    Loading projects...
                                </p>

                            </div>

                        ) : projects.length === 0 ? (

                            <div className="skills-empty">

                                <p>
                                    No projects added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="skills-add-button"
                                >
                                    + Add Project
                                </button>

                            </div>

                        ) : (

                            <table className="skills-table projects-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Project
                                        </th>

                                        <th>
                                            Technologies
                                        </th>

                                        <th>
                                            Featured
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {projects.map(
                                        (currentProject) => (

                                            <tr
                                                key={
                                                    currentProject.id
                                                }
                                            >

                                                <td>

                                                    <span className="project-title">
                                                        {
                                                            currentProject.title
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="project-technologies">
                                                        {
                                                            currentProject.technologies ||
                                                            "—"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="project-featured">

                                                        {currentProject.featured
                                                            ? "Yes"
                                                            : "No"}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="skill-actions">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    currentProject
                                                                )
                                                            }
                                                            className="skill-edit-button"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    currentProject.id
                                                                )
                                                            }
                                                            className="skill-delete-button"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminProjects;