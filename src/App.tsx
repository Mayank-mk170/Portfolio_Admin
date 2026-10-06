import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AdminSignup from "./admin/pages/AdminSignup";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAbout from "./admin/pages/AdminAbout";
import AdminSkills from "./admin/pages/AdminSkills";
import AdminServices from "./admin/pages/AdminServices";
import AdminProjects from "./admin/pages/AdminProjects";
import AdminBlogs from "./admin/pages/AdminBlogs";
import AdminExperience from "./admin/pages/AdminExperience";
import AdminTestimonials from "./admin/pages/AdminTestimonials";

import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminUploads from "./admin/pages/AdminUploads";

import Toast from "./admin/components/Toast";

import AdminUser from "./admin/pages/AdminUser";
import AdminMessages from "./admin/pages/AdminMessages";


function App() {

    return (
        <>
            {/* Global Toast */}
            <Toast />

            <BrowserRouter>

                <Routes>

                    {/* DEFAULT */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/admin/login"
                                replace
                            />
                        }
                    />


                    {/* AUTHENTICATION */}

                    <Route
                        path="/admin/signup"
                        element={<AdminSignup />}
                    />

                    <Route
                        path="/admin/login"
                        element={<AdminLogin />}
                    />


                    {/* PROTECTED ADMIN */}

                    <Route
                        element={<ProtectedRoute />}
                    >

                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/about"
                            element={<AdminAbout />}
                        />

                        <Route
                            path="/admin/skills"
                            element={<AdminSkills />}
                        />

                        <Route
                            path="/admin/projects"
                            element={<AdminProjects />}
                        />

                        <Route
                            path="/admin/blogs"
                            element={<AdminBlogs />}
                        />

                        <Route
                            path="/admin/experience"
                            element={<AdminExperience />}
                        />

                        <Route
                            path="/admin/services"
                            element={<AdminServices />}
                        />

                        <Route
                            path="/admin/testimonials"
                            element={<AdminTestimonials />}
                        />

                        <Route
                            path="/admin/uploads"
                            element={<AdminUploads />}
                        />

                        <Route
                            path="/admin/messages"
                            element={<AdminMessages />}
                        />

                        <Route
                            path="/admin/user"
                            element={<AdminUser />}
                        />

                    </Route>

                </Routes>

            </BrowserRouter>
        </>
    );
}

export default App;