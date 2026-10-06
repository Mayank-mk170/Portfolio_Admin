import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";

interface Skill {
    id?: number;
    name: string;
    category: string;
    icon: string;
    proficiency: number;
    displayOrder: number;
}

const emptySkill: Skill = {
    name: "",
    category: "",
    icon: "",
    proficiency: 0,
    displayOrder: 0,
};

function AdminSkills() {

    const [skills, setSkills] = useState<Skill[]>([]);

    const [skill, setSkill] =
        useState<Skill>(emptySkill);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [showModal, setShowModal] =
        useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {

        try {

            const response =
                await api.get("/skills");

            setSkills(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const {
            name,
            value
        } = event.target;

        setSkill((previous) => ({
            ...previous,

            [name]:
                name === "proficiency" ||
                name === "displayOrder"
                    ? Number(value)
                    : value,
        }));
    };

    const openAddModal = () => {

        setSkill(emptySkill);
        setEditingId(null);

        setShowModal(true);
    };

    const handleEdit = (
        selectedSkill: Skill
    ) => {

        setSkill({
            id: selectedSkill.id,
            name: selectedSkill.name,
            category:
                selectedSkill.category || "",
            icon:
                selectedSkill.icon || "",
            proficiency:
                selectedSkill.proficiency,
            displayOrder:
                selectedSkill.displayOrder,
        });

        setEditingId(
            selectedSkill.id ?? null
        );

        setShowModal(true);
    };

    const handleSave = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        try {

            setSaving(true);

            if (editingId) {

                const response =
                    await api.put(
                        `/skills/${editingId}`,
                        skill
                    );

                setSkills((previous) =>
                    previous.map((item) =>
                        item.id === editingId
                            ? response.data
                            : item
                    )
                );

            } else {

                const response =
                    await api.post(
                        "/skills",
                        skill
                    );

                setSkills((previous) => [
                    ...previous,
                    response.data,
                ]);
            }

            setSkill(emptySkill);
            setEditingId(null);
            setShowModal(false);

            await loadSkills();

        } catch (error) {
            console.error("Request failed:", error);
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
                `/skills/${id}`
            );

            setSkills((previous) =>
                previous.filter(
                    (item) => item.id !== id
                )
            );

        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const handleCloseModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);
        setSkill(emptySkill);
        setEditingId(null);
    };

    return (
        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">

                    <header className="skills-page-header">

                        <div>
                            <div className="admin-page-label">
                                <span>CMS / 02</span>
                            </div>

                            <h1 className="admin-page-title">
                                Skills
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="skills-add-button"
                        >
                            + Add Skill
                        </button>

                    </header>

                    <section className="skills-table-container">

                        {loading ? (

                            <p className="admin-page-description">
                                Loading skills...
                            </p>

                        ) : skills.length === 0 ? (

                            <div className="skills-empty">

                                <p>
                                    No skills added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={openAddModal}
                                    className="skills-add-button"
                                >
                                    + Add Skill
                                </button>

                            </div>

                        ) : (

                            <table className="skills-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Proficiency
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {skills.map(
                                        (currentSkill) => (

                                            <tr
                                                key={
                                                    currentSkill.id
                                                }
                                            >

                                                <td>
                                                    <span className="skill-name">
                                                        {
                                                            currentSkill.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="skill-category">
                                                        {
                                                            currentSkill.category ||
                                                            "—"
                                                        }
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="skill-proficiency">

                                                        <div className="skill-proficiency-bar">

                                                            <div
                                                                className="skill-proficiency-fill"
                                                                style={{
                                                                    width: `${currentSkill.proficiency}%`,
                                                                }}
                                                            />

                                                        </div>

                                                        <span>
                                                            {
                                                                currentSkill.proficiency
                                                            }%
                                                        </span>

                                                    </div>

                                                </td>

                                                <td>

                                                    <div className="skill-actions">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    currentSkill
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
                                                                    currentSkill.id
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

                    </section>

                </div>

            </main>


            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div
                    className="skill-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseModal();
                        }

                    }}
                >

                    <div className="skill-modal">

                        <div className="skill-modal-header">

                            <div>

                                <div className="admin-page-label">
                                    <span>
                                        {editingId
                                            ? "EDIT SKILL"
                                            : "NEW SKILL"}
                                    </span>
                                </div>

                                <h2>
                                    {editingId
                                        ? "Edit Skill"
                                        : "Add Skill"}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                                className="skill-modal-close"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSave}
                            className="skill-modal-form"
                        >

                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={skill.name}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="admin-input"
                                    placeholder="Java"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Category
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={
                                        skill.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="admin-input"
                                    placeholder="Backend"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Icon
                                </label>

                                <input
                                    type="text"
                                    name="icon"
                                    value={skill.icon}
                                    onChange={
                                        handleChange
                                    }
                                    className="admin-input"
                                    placeholder="java"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Proficiency
                                </label>

                                <input
                                    type="number"
                                    name="proficiency"
                                    value={
                                        skill.proficiency
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    max="100"
                                    required
                                    className="admin-input"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={
                                        skill.displayOrder
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    required
                                    className="admin-input"
                                />

                            </div>


                            <div className="skill-modal-actions">

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseModal
                                    }
                                    className="skill-cancel-button"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="skills-add-button"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Skill"
                                            : "Add Skill"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminSkills;