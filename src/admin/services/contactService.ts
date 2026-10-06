import api from "../../services/api";

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    createdAt: string;
}

export const getContactMessages = async (): Promise<ContactMessage[]> => {
    const response = await api.get<ContactMessage[]>("/contact");

    return response.data;
};

export const getContactMessage = async (
    id: number
): Promise<ContactMessage> => {
    const response = await api.get<ContactMessage>(
        `/contact/${id}`
    );

    return response.data;
};

export const deleteContactMessage = async (
    id: number
): Promise<void> => {
    await api.delete(`/contact/${id}`);
};