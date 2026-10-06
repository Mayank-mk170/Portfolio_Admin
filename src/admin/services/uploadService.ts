import api from "../../services/api";

export interface Upload {
    id: number;
    originalFileName: string;
    fileUrl: string;
    s3Key: string;
    contentType: string;
    fileSize: number;
    category: string;
    createdAt: string;
}


// ==========================================
// UPLOAD FILE
// ==========================================

export const uploadFile = async (
    file: File,
    category: string
): Promise<Upload> => {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("category", category);

    const response = await api.post(
        "/uploads",
        formData,
        {
            headers: {
                "Content-Type": undefined,
            },
        }
    );

    return response.data;
};


// ==========================================
// GET ALL UPLOADS
// ==========================================

export const getUploads = async (): Promise<Upload[]> => {

    const response = await api.get("/uploads");

    return response.data;
};