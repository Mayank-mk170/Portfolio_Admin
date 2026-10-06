import { useEffect, useState } from "react";
import {
    getUploads,
    type Upload,
} from "../services/uploadService";
import { showToast } from "../components/Toast";

interface AssetPickerProps {
    category: string;
    value: string;
    onSelect: (url: string) => void;
    label: string;
}

function AssetPicker({
    category,
    value,
    onSelect,
    label,
}: AssetPickerProps) {

    const [uploads, setUploads] = useState<Upload[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadUploads = async () => {

        try {

            setLoading(true);

            const data = await getUploads();

            const filtered = data.filter(
                (upload) =>
                    upload.category.toUpperCase() ===
                    category.toUpperCase()
            );

            setUploads(filtered);

        } catch (error) {

            console.error(
                "Unable to load uploaded files:",
                error
            );

            showToast(
                "Unable to load uploaded files",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (open) {
            loadUploads();
        }

    }, [open]);


    const handleSelect = (upload: Upload) => {

        onSelect(upload.fileUrl);

        setOpen(false);

        showToast(
            "File selected successfully",
            "success"
        );
    };


    return (
        <div className="asset-picker">

            <label className="admin-form-label">
                {label}
            </label>


            {/* CURRENT URL */}

            {value && (

                <div className="asset-current">

                    <div className="asset-current-preview">

                        {category === "CV" ? (

                            <div className="asset-pdf-preview">
                                PDF
                            </div>

                        ) : (

                            <img
                                src={value}
                                alt="Selected asset"
                            />

                        )}

                    </div>

                    <div className="asset-current-info">

                        <span>
                            File selected
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                onSelect("")
                            }
                        >
                            Remove
                        </button>

                    </div>

                </div>

            )}


            {/* SELECT BUTTON */}

            <button
                type="button"
                className="asset-picker-button"
                onClick={() => setOpen(true)}
            >
                {value
                    ? "Change File"
                    : "Select from Uploads"}
            </button>


            {/* UPLOAD LIST */}

            {open && (

                <div className="asset-picker-panel">

                    <div className="asset-picker-header">

                        <div>

                            <span>
                                AVAILABLE FILES
                            </span>

                            <strong>
                                {category}
                            </strong>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="asset-picker-close"
                        >
                            Close
                        </button>

                    </div>


                    {loading ? (

                        <div className="asset-picker-empty">
                            Loading files...
                        </div>

                    ) : uploads.length === 0 ? (

                        <div className="asset-picker-empty">

                            No {category.toLowerCase()} files
                            uploaded yet.

                        </div>

                    ) : (

                        <div className="asset-picker-grid">

                            {uploads.map((upload) => (

                                <button
                                    type="button"
                                    key={upload.id}
                                    className="asset-item"
                                    onClick={() =>
                                        handleSelect(
                                            upload
                                        )
                                    }
                                >

                                    <div className="asset-item-preview">

                                        {upload.contentType.startsWith(
                                            "image/"
                                        ) ? (

                                            <img
                                                src={
                                                    upload.fileUrl
                                                }
                                                alt={
                                                    upload.originalFileName
                                                }
                                            />

                                        ) : (

                                            <div className="asset-pdf-preview">
                                                PDF
                                            </div>

                                        )}

                                    </div>


                                    <div className="asset-item-info">

                                        <strong>
                                            {
                                                upload.originalFileName
                                            }
                                        </strong>

                                        <span>
                                            {(
                                                upload.fileSize /
                                                1024
                                            ).toFixed(1)}{" "}
                                            KB
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}

export default AssetPicker;