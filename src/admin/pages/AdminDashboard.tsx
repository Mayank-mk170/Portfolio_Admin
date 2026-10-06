import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../../services/api";

interface DashboardCounts {
    skills: number;
    projects: number;
    blogs: number;
    experience: number;
    services: number;
    testimonials: number;
}

function AdminDashboard() {

    const [counts, setCounts] = useState<DashboardCounts>({
        skills: 0,
        projects: 0,
        blogs: 0,
        experience: 0,
        services: 0,
        testimonials: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCounts();
    }, []);

    const loadCounts = async () => {
        try {
            const [
                skillsResponse,
                projectsResponse,
                blogsResponse,
                experienceResponse,
                servicesResponse,
                testimonialsResponse,
            ] = await Promise.all([
                api.get("/skills"),
                api.get("/projects"),
                api.get("/blogs"),
                api.get("/experience"),
                api.get("/services"),
                api.get("/testimonials"),
            ]);

            setCounts({
                skills: skillsResponse.data.length,
                projects: projectsResponse.data.length,
                blogs: blogsResponse.data.length,
                experience: experienceResponse.data.length,
                services: servicesResponse.data.length,
                testimonials: testimonialsResponse.data.length,
            });

        } catch (error) {
            console.error(
                "Unable to load dashboard data:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">

                    <header className="admin-page-header">

                        <div className="admin-page-label">
                            <span>CMS </span>
                        </div>

                        <h1 className="admin-page-title">
                            Dashboard
                        </h1>

                        <p className="admin-page-description">
                            Manage all content of your portfolio
                            from one place.
                        </p>

                    </header>


                    <section className="dashboard-grid">

                        {/* ABOUT */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                01 / ABOUT
                            </div>

                            <h2>
                                About
                            </h2>

                            <p>
                                Manage your personal information,
                                introduction, profile image and resume.
                            </p>

                            <a
                                href="/admin/about"
                                className="dashboard-card-link"
                            >
                                Manage About ↗
                            </a>

                        </div>


                        {/* SKILLS */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                02 / SKILLS
                            </div>

                            <h2>
                                Skills
                            </h2>

                            <div className="dashboard-count">
                                {loading
                                    ? "—"
                                    : counts.skills}
                            </div>

                            <p>
                                Manage the technical skills
                                displayed on your portfolio.
                            </p>

                            <a
                                href="/admin/skills"
                                className="dashboard-card-link"
                            >
                                Manage Skills ↗
                            </a>

                        </div>


                        {/* PROJECTS */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                03 / PROJECTS
                            </div>

                            <h2>
                                Projects
                            </h2>

                            <div className="dashboard-count">
                                {loading
                                    ? "—"
                                    : counts.projects}
                            </div>

                            <p>
                                Manage your portfolio projects.
                            </p>

                            <a
                                href="/admin/projects"
                                className="dashboard-card-link"
                            >
                                Manage Projects ↗
                            </a>

                        </div>


                        {/* BLOGS */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                04 / BLOGS
                            </div>

                            <h2>
                                Blogs
                            </h2>

                            <div className="dashboard-count">
                                {loading
                                    ? "—"
                                    : counts.blogs}
                            </div>

                            <p>
                                Create and manage your
                                portfolio blog posts.
                            </p>

                            <a
                                href="/admin/blogs"
                                className="dashboard-card-link"
                            >
                                Manage Blogs ↗
                            </a>

                        </div>


                        {/* EXPERIENCE */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                05 / EXPERIENCE
                            </div>

                            <h2>
                                Experience
                            </h2>

                            <div className="dashboard-count">
                                {loading
                                    ? "—"
                                    : counts.experience}
                            </div>

                            <p>
                                Manage your professional
                                experience.
                            </p>

                            <a
                                href="/admin/experience"
                                className="dashboard-card-link"
                            >
                                Manage Experience ↗
                            </a>

                        </div>


                        {/* SERVICES */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                06 / SERVICES
                            </div>

                            <h2>
                                Services
                            </h2>

                            <div className="dashboard-count">
                                {loading
                                    ? "—"
                                    : counts.services}
                            </div>

                            <p>
                                Manage the services offered
                                on your portfolio.
                            </p>

                            <a
                                href="/admin/services"
                                className="dashboard-card-link"
                            >
                                Manage Services ↗
                            </a>

                        </div>


                        {/* TESTIMONIALS */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-number">
                                07 / TESTIMONIALS
                            </div>

                            <h2>
                                Testimonials
                            </h2>

                            <div className="dashboard-count">
                                {loading
                                    ? "—"
                                    : counts.testimonials}
                            </div>

                            <p>
                                Manage testimonials from
                                clients and colleagues.
                            </p>

                            <a
                                href="/admin/testimonials"
                                className="dashboard-card-link"
                            >
                                Manage Testimonials ↗
                            </a>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;