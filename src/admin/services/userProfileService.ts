import api from "../../services/api";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    education: string;
}

export interface UserProfileRequest {
    name: string;
    email: string;
    education: string;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
        const response = await api.get<UserProfile>("/user-profile");
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }

        throw error;
    }
};

export const saveUserProfile = async (
    data: UserProfileRequest
): Promise<UserProfile> => {
    const response = await api.post<UserProfile>(
        "/user-profile",
        data
    );

    return response.data;
};