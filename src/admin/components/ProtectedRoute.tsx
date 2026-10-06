import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/adminAuthService";

function ProtectedRoute() {

    const token = getToken();

    if (!token) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;