import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";
import { showToast } from "../services/toast";

import AssetPicker from "../components/AssetPicker";

interface Blog {
    id?: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    author: string;
    tags: string[];
    published: boolean;
}

const emptyBlog: Blog = {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    author: "Admin",
    tags: [],
    published: false,
};

function AdminBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blog, setBlog] = useState<Blog>(emptyBlog);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tagsInput, setTagsInput] = useState("");

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const response = await api.get("/blogs");
            setBlogs(response.data);
        } catch (error) {
            console.error(error);
            showToast("Unable to load blogs", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = event.target;

        if (type === "checkbox") {
            const checked = (event.target as HTMLInputElement).checked;

            setBlog((previous) => ({
                ...previous,
                [name]: checked,
            }));

            return;
        }

        setBlog((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAdd = () => {
        setBlog(emptyBlog);
        setTagsInput("");
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (selectedBlog: Blog) => {
        setBlog({
            id: selectedBlog.id,
            title: selectedBlog.title,
            slug: selectedBlog.slug,
            content: selectedBlog.content,
            excerpt: selectedBlog.excerpt || "",
            image: selectedBlog.image || "",
            author: selectedBlog.author || "Admin",
            tags: selectedBlog.tags || [],
            published: selectedBlog.published || false,
        });

        setTagsInput((selectedBlog.tags || []).join(", "));
        setEditingId(selectedBlog.id ?? null);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCancel = () => {
        setBlog(emptyBlog);
        setTagsInput("");
        setEditingId(null);
        setShowForm(false);
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setSaving(true);

            const tags = tagsInput
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            const blogData = {
                ...blog,
                tags,
            };

            if (editingId) {
                await api.put(`/blogs/${editingId}`, blogData);

                showToast(
                    "Blog updated successfully",
                    "success"
                );
            } else {
                await api.post("/blogs", blogData);

                showToast(
                    "Blog added successfully",
                    "success"
                );
            }

            setBlog(emptyBlog);
            setTagsInput("");
            setEditingId(null);
            setShowForm(false);

            await loadBlogs();
        } catch (error: any) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                "Unable to save blog",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;

        try {
            await api.delete(`/blogs/${id}`);

            setBlogs((previous) =>
                previous.filter((item) => item.id !== id)
            );

            showToast(
                "Blog deleted successfully",
                "success"
            );
        } catch (error: any) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                "Unable to delete blog",
                "error"
            );
        }
    };

    return (
        <div className="admin-background">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-content">

                    {/* PAGE HEADER */}
                    <header className="skills-page-header">
                        <div>
                            <div className="admin-page-label">
                                <span>CMS / 05</span>
                            </div>

                            <h1 className="admin-page-title">
                                Blogs
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="skills-add-button"
                        >
                            + Add Blog
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
                                    Blog Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={blog.title}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="Introduction to Spring Boot"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Slug
                                </label>

                                <input
                                    type="text"
                                    name="slug"
                                    value={blog.slug}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="introduction-to-spring-boot"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Content
                                </label>

                                <textarea
                                    name="content"
                                    value={blog.content}
                                    onChange={handleChange}
                                    required
                                    rows={10}
                                    className="admin-input"
                                    placeholder="Write your blog content..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Excerpt
                                </label>

                                <textarea
                                    name="excerpt"
                                    value={blog.excerpt}
                                    onChange={handleChange}
                                    rows={4}
                                    className="admin-input"
                                    placeholder="Short description of the blog"
                                />
                            </div>

                            <div className="admin-form-group">

                                <AssetPicker
                                    category="BLOG"
                                    value={blog.image}
                                    onSelect={(url) =>
                                        setBlog((previous) => ({
                                            ...previous,
                                            image: url,
                                        }))
                                    }
                                    label="Blog Image"
                                />

                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Author
                                </label>

                                <input
                                    type="text"
                                    name="author"
                                    value={blog.author}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="Admin"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Tags
                                </label>

                                <input
                                    type="text"
                                    value={tagsInput}
                                    onChange={(event) =>
                                        setTagsInput(event.target.value)
                                    }
                                    className="admin-input"
                                    placeholder="Java, Spring Boot, Backend"
                                />

                                <small className="admin-form-help">
                                    Separate tags with commas.
                                </small>
                            </div>

                            <div className="admin-form-group">
                                <label className="experience-checkbox">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={blog.published}
                                        onChange={handleChange}
                                    />

                                    Published
                                </label>
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
                                            ? "Update Blog"
                                            : "Add Blog"}
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

                    {/* BLOG TABLE */}
                    <div className="skills-table-container">

                        {loading ? (
                            <div className="skills-empty">
                                <p>Loading blogs...</p>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="skills-empty">
                                <p>No blogs added yet.</p>

                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="skills-add-button"
                                >
                                    + Add Blog
                                </button>
                            </div>
                        ) : (
                            <table className="skills-table blogs-table">

                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Status</th>
                                        <th>Tags</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {blogs.map((currentBlog) => (
                                        <tr key={currentBlog.id}>

                                            <td>
                                                <span className="blog-title">
                                                    {currentBlog.title}
                                                </span>

                                                <span className="blog-slug">
                                                    /{currentBlog.slug}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="blog-author">
                                                    {currentBlog.author || "Admin"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        currentBlog.published
                                                            ? "blog-status published"
                                                            : "blog-status draft"
                                                    }
                                                >
                                                    {currentBlog.published
                                                        ? "Published"
                                                        : "Draft"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="blog-tags">
                                                    {currentBlog.tags &&
                                                        currentBlog.tags.length > 0
                                                        ? currentBlog.tags.join(", ")
                                                        : "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="skill-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                currentBlog
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
                                                                currentBlog.id
                                                            )
                                                        }
                                                        className="skill-delete-button"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        )}

                    </div>

                </div>
            </main>
        </div>
    );
}

export default AdminBlogs;