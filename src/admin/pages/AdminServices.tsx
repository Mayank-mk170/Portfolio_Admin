import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";
import { showToast } from "../services/toast";

import AssetPicker from "../components/AssetPicker";

interface PortfolioService {
    id?: number;
    title: string;
    description: string;
    icon: string;
    image: string;
    order: number;
}

const emptyService: PortfolioService = {
    title: "",
    description: "",
    icon: "",
    image: "",
    order: 0,
};

function AdminServices() {
    const [services, setServices] = useState<PortfolioService[]>([]);
    const [service, setService] =
        useState<PortfolioService>(emptyService);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const response = await api.get("/services");

            const sortedServices = [...response.data].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0)
            );

            setServices(sortedServices);
        } catch (error) {
            console.error(error);
            showToast(
                "Unable to load services",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = event.target;

        setService((previous) => ({
            ...previous,
            [name]:
                name === "order"
                    ? Number(value)
                    : value,
        }));
    };

    const handleAdd = () => {
        setService(emptyService);
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (
        selectedService: PortfolioService
    ) => {
        setService({
            id: selectedService.id,
            title: selectedService.title,
            description: selectedService.description || "",
            icon: selectedService.icon || "",
            image: selectedService.image || "",
            order: selectedService.order || 0,
        });

        setEditingId(selectedService.id ?? null);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCancel = () => {
        setService(emptyService);
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
                    `/services/${editingId}`,
                    service
                );

                showToast(
                    "Service updated successfully",
                    "success"
                );
            } else {
                await api.post(
                    "/services",
                    service
                );

                showToast(
                    "Service added successfully",
                    "success"
                );
            }

            setService(emptyService);
            setEditingId(null);
            setShowForm(false);

            await loadServices();
        } catch (error: any) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                "Unable to save service",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;

        try {
            await api.delete(`/services/${id}`);

            setServices((previous) =>
                previous.filter(
                    (item) => item.id !== id
                )
            );

            showToast(
                "Service deleted successfully",
                "success"
            );
        } catch (error: any) {
            console.error(error);

            showToast(
                error.response?.data?.message ||
                "Unable to delete service",
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
                                <span>CMS / 07</span>
                            </div>

                            <h1 className="admin-page-title">
                                Services
                            </h1>

                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="skills-add-button"
                        >
                            + Add Service
                        </button>

                    </header>


                    {/* FORM */}

                    {showForm && (
                        <form
                            onSubmit={handleSave}
                            className="skill-form"
                        >

                            {/* TITLE */}

                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Service Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={service.title}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    placeholder="Web Development"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={service.description}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="admin-input"
                                    placeholder="Describe the service..."
                                />

                            </div>


                            {/* ICON */}

                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Icon URL
                                </label>

                                <input
                                    type="text"
                                    name="icon"
                                    value={service.icon}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="https://example.com/icon.svg"
                                />

                            </div>


                            {/* IMAGE */}

                            <div className="admin-form-group">

                                <AssetPicker
                                    category="SERVICE"
                                    value={service.image}
                                    onSelect={(url) =>
                                        setService((previous) => ({
                                            ...previous,
                                            image: url,
                                        }))
                                    }
                                    label="Service Image"
                                />

                            </div>


                            {/* ORDER */}

                            <div className="admin-form-group">

                                <label className="admin-form-label">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="order"
                                    value={service.order}
                                    onChange={handleChange}
                                    min="0"
                                    className="admin-input"
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="admin-actions">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="admin-button"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Service"
                                            : "Add Service"}
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


                    {/* SERVICES TABLE */}

                    <div className="skills-table-container">

                        {loading ? (

                            <div className="skills-empty">
                                <p>
                                    Loading services...
                                </p>
                            </div>

                        ) : services.length === 0 ? (

                            <div className="skills-empty">

                                <p>
                                    No services added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="skills-add-button"
                                >
                                    + Add Service
                                </button>

                            </div>

                        ) : (

                            <table className="skills-table services-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Service
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Order
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {services.map(
                                        (currentService) => (

                                            <tr
                                                key={
                                                    currentService.id
                                                }
                                            >

                                                <td>

                                                    <span className="service-title">
                                                        {
                                                            currentService.title
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="service-description">
                                                        {
                                                            currentService.description
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="service-order">
                                                        {
                                                            currentService.order
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="skill-actions">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    currentService
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
                                                                    currentService.id
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

export default AdminServices;