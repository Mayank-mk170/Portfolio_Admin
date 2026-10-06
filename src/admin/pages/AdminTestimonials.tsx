import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";
import { showToast } from "../services/toast";

import AssetPicker from "../components/AssetPicker";

interface Testimonial {
    id?: number;
    name: string;
    position: string;
    company: string;
    content: string;
    image: string;
    rating: number;
    featured: boolean;
    order: number;
}

const emptyTestimonial: Testimonial = {
    name: "",
    position: "",
    company: "",
    content: "",
    image: "",
    rating: 5,
    featured: false,
    order: 0,
};

function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [testimonial, setTestimonial] =
        useState<Testimonial>(emptyTestimonial);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const response = await api.get("/testimonials");
            setTestimonials(response.data);
        } catch (error) {
            console.error(error);
            showToast("Unable to load testimonials", "error");
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

            setTestimonial((previous) => ({
                ...previous,
                [name]: checked,
            }));

            return;
        }

        setTestimonial((previous) => ({
            ...previous,
            [name]:
                name === "rating" || name === "order"
                    ? Number(value)
                    : value,
        }));
    };

    const handleAdd = () => {
        setTestimonial(emptyTestimonial);
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (selectedTestimonial: Testimonial) => {
        setTestimonial({
            id: selectedTestimonial.id,
            name: selectedTestimonial.name,
            position: selectedTestimonial.position || "",
            company: selectedTestimonial.company || "",
            content: selectedTestimonial.content,
            image: selectedTestimonial.image || "",
            rating: selectedTestimonial.rating || 5,
            featured: selectedTestimonial.featured || false,
            order: selectedTestimonial.order || 0,
        });

        setEditingId(selectedTestimonial.id ?? null);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCancel = () => {
        setTestimonial(emptyTestimonial);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setSaving(true);

            const testimonialData = {
                ...testimonial,
                rating: Math.min(
                    5,
                    Math.max(1, testimonial.rating)
                ),
            };

            if (editingId) {
                await api.put(
                    `/testimonials/${editingId}`,
                    testimonialData
                );

                showToast(
                    "Testimonial updated successfully",
                    "success"
                );
            } else {
                await api.post(
                    "/testimonials",
                    testimonialData
                );

                showToast(
                    "Testimonial added successfully",
                    "success"
                );
            }

            setTestimonial(emptyTestimonial);
            setEditingId(null);
            setShowForm(false);

            await loadTestimonials();
        } catch (error: any) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                "Unable to save testimonial",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;

        try {
            await api.delete(`/testimonials/${id}`);

            setTestimonials((previous) =>
                previous.filter((item) => item.id !== id)
            );

            showToast(
                "Testimonial deleted successfully",
                "success"
            );
        } catch (error: any) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                "Unable to delete testimonial",
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
                                <span>CMS / 06</span>
                            </div>

                            <h1 className="admin-page-title">
                                Testimonials
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="skills-add-button"
                        >
                            + Add Testimonial
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
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={testimonial.name}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Position
                                </label>

                                <input
                                    type="text"
                                    name="position"
                                    value={testimonial.position}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="Software Engineer"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Company
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={testimonial.company}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="ABC Technologies"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Testimonial
                                </label>

                                <textarea
                                    name="content"
                                    value={testimonial.content}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="admin-input"
                                    placeholder="Write the testimonial..."
                                />
                            </div>

                            <div className="admin-form-group">

                                <AssetPicker
                                    category="TESTIMONIAL"
                                    value={testimonial.image}
                                    onSelect={(url) =>
                                        setTestimonial((previous) => ({
                                            ...previous,
                                            image: url,
                                        }))
                                    }
                                    label="Testimonial Image"
                                />

                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={testimonial.rating}
                                    onChange={handleChange}
                                    min="1"
                                    max="5"
                                    required
                                    className="admin-input"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="experience-checkbox">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={testimonial.featured}
                                        onChange={handleChange}
                                    />

                                    Featured Testimonial
                                </label>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="order"
                                    value={testimonial.order}
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
                                            ? "Update Testimonial"
                                            : "Add Testimonial"}
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

                    {/* TABLE */}
                    <div className="skills-table-container">

                        {loading ? (
                            <div className="skills-empty">
                                <p>Loading testimonials...</p>
                            </div>
                        ) : testimonials.length === 0 ? (
                            <div className="skills-empty">
                                <p>No testimonials added yet.</p>

                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="skills-add-button"
                                >
                                    + Add Testimonial
                                </button>
                            </div>
                        ) : (
                            <table className="skills-table testimonials-table">

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Rating</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {testimonials.map(
                                        (currentTestimonial) => (
                                            <tr
                                                key={
                                                    currentTestimonial.id
                                                }
                                            >
                                                <td>
                                                    <span className="testimonial-name">
                                                        {
                                                            currentTestimonial.name
                                                        }
                                                    </span>

                                                    <span className="testimonial-company">
                                                        {
                                                            currentTestimonial.company
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="testimonial-position">
                                                        {
                                                            currentTestimonial.position ||
                                                            "—"
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="testimonial-rating">
                                                        {"★".repeat(
                                                            currentTestimonial.rating ||
                                                            0
                                                        )}
                                                        {"☆".repeat(
                                                            5 -
                                                            (currentTestimonial.rating ||
                                                                0)
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            currentTestimonial.featured
                                                                ? "testimonial-featured"
                                                                : "testimonial-not-featured"
                                                        }
                                                    >
                                                        {
                                                            currentTestimonial.featured
                                                                ? "Yes"
                                                                : "No"
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="skill-actions">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    currentTestimonial
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
                                                                    currentTestimonial.id
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

export default AdminTestimonials;