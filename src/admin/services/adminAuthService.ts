import api from "../../services/api";

export interface SignupRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tokenType: string;
}

export const adminSignup = async (
    data: SignupRequest
) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};

export const adminLogin = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const saveToken = (token: string) => {
    localStorage.setItem(
        "adminToken",
        token
    );
};

export const getToken = () => {
    return localStorage.getItem(
        "adminToken"
    );
};

export const logout = () => {
    localStorage.removeItem(
        "adminToken"
    );
};