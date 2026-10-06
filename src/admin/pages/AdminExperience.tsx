import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";
import { showToast } from "../services/toast";

interface Experience {
    id?: number;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    order: number;
}

const emptyExperience: Experience = {
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    order: 0,
};

function AdminExperience() {

    const [experiences, setExperiences] =
        useState<Experience[]>([]);

    const [experience, setExperience] =
        useState<Experience>(emptyExperience);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [showForm, setShowForm] =
        useState(false);


    useEffect(() => {
        loadExperiences();
    }, []);


    const loadExperiences = async () => {

        try {

            const response =
                await api.get("/experience");

            setExperiences(response.data);

        } catch (error) {

            console.error(error);

            showToast(
                "Unable to load experience",
                "error"
            );

        } finally {

            setLoading(false);
        }
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

            setExperience((previous) => ({
                ...previous,
                [name]: checked,
            }));

            return;
        }

        setExperience((previous) => ({
            ...previous,

            [name]:
                name === "order"
                    ? Number(value)
                    : value,
        }));
    };


    const handleAdd = () => {

        setExperience(emptyExperience);

        setEditingId(null);

        setShowForm(true);
    };


    const handleEdit = (
        selectedExperience: Experience
    ) => {

        setExperience({
            id: selectedExperience.id,
            company:
                selectedExperience.company,
            position:
                selectedExperience.position,
            description:
                selectedExperience.description || "",
            startDate:
                selectedExperience.startDate || "",
            endDate:
                selectedExperience.endDate || "",
            currentlyWorking:
                selectedExperience.currentlyWorking || false,
            order:
                selectedExperience.order || 0,
        });

        setEditingId(
            selectedExperience.id ?? null
        );

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleCancel = () => {

        setExperience(emptyExperience);

        setEditingId(null);

        setShowForm(false);
    };


    const handleSave = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            setSaving(true);

            if (editingId) {

                await api.put(
                    `/experience/${editingId}`,
                    experience
                );

                showToast(
                    "Experience updated successfully",
                    "success"
                );

            } else {

                await api.post(
                    "/experience",
                    experience
                );

                showToast(
                    "Experience added successfully",
                    "success"
                );
            }

            setExperience(emptyExperience);

            setEditingId(null);

            setShowForm(false);

            await loadExperiences();

        } catch (error: any) {

            showToast(
                error.response?.data?.message ||
                "Unable to save experience",
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
                `/experience/${id}`
            );

            setExperiences((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== id
                )
            );

            showToast(
                "Experience deleted successfully",
                "success"
            );

        } catch (error: any) {

            showToast(
                error.response?.data?.message ||
                "Unable to delete experience",
                "error"
            );
        }
    };


    const formatDate = (
        date: string
    ) => {

        if (!date) {
            return "Present";
        }

        const [year, month] =
            date.split("-");

        const dateObject =
            new Date(
                Number(year),
                Number(month) - 1
            );

        return dateObject.toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric",
            }
        );
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
                                    CMS / 04
                                </span>

                            </div>

                            <h1 className="admin-page-title">
                                Experience
                            </h1>

                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="skills-add-button"
                        >
                            + Add Experience
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
                                    Company
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={
                                        experience.company
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="admin-input"
                                    placeholder="Altruist Technology"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Position
                                </label>

                                <input
                                    type="text"
                                    name="position"
                                    value={
                                        experience.position
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="admin-input"
                                    placeholder="Business Associate"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        experience.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="admin-input"
                                    placeholder="Describe your work experience"
                                    rows={5}
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={
                                        experience.startDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="admin-input"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={
                                        experience.endDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        experience.currentlyWorking
                                    }
                                    className="admin-input"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="experience-checkbox">

                                    <input
                                        type="checkbox"
                                        name="currentlyWorking"
                                        checked={
                                            experience.currentlyWorking
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    Currently Working

                                </label>

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="order"
                                    value={
                                        experience.order
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                            ? "Update Experience"
                                            : "Add Experience"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    className="admin-button"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}


                    {/* EXPERIENCE TABLE */}

                    <div className="skills-table-container">

                        {loading ? (

                            <div className="skills-empty">
                                <p>
                                    Loading experience...
                                </p>
                            </div>

                        ) : experiences.length === 0 ? (

                            <div className="skills-empty">

                                <p>
                                    No experience added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="skills-add-button"
                                >
                                    + Add Experience
                                </button>

                            </div>

                        ) : (

                            <table className="skills-table experience-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Company
                                        </th>

                                        <th>
                                            Position
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {experiences.map(
                                        (currentExperience) => (

                                            <tr
                                                key={
                                                    currentExperience.id
                                                }
                                            >

                                                <td>

                                                    <span className="experience-company">
                                                        {
                                                            currentExperience.company
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="experience-position">
                                                        {
                                                            currentExperience.position
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="experience-date">

                                                        {
                                                            formatDate(
                                                                currentExperience.startDate
                                                            )
                                                        }

                                                        {" → "}

                                                        {currentExperience.currentlyWorking
                                                            ? "Present"
                                                            : formatDate(
                                                                currentExperience.endDate
                                                            )}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="skill-actions">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    currentExperience
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
                                                                    currentExperience.id
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

export default AdminExperience;