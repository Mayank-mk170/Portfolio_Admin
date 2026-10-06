import { useEffect, useState } from "react";

interface ToastData {
    message: string;
    type: "success" | "error";
}

function Toast() {

    const [toast, setToast] =
        useState<ToastData | null>(null);

    useEffect(() => {

        const handleToast = (event: Event) => {

            const customEvent =
                event as CustomEvent<ToastData>;

            setToast(customEvent.detail);

            const timer = setTimeout(() => {
                setToast(null);
            }, 2000);

            return () => {
                clearTimeout(timer);
            };
        };

        window.addEventListener(
            "app-toast",
            handleToast
        );

        return () => {

            window.removeEventListener(
                "app-toast",
                handleToast
            );

        };

    }, []);

    if (!toast) {
        return null;
    }

    return (
        <div
            className={`global-toast ${toast.type}`}
        >
            {toast.message}
        </div>
    );
}


// ==========================================
// SHOW TOAST
// ==========================================

export const showToast = (
    message: string,
    type: "success" | "error" = "success"
) => {

    window.dispatchEvent(
        new CustomEvent("app-toast", {
            detail: {
                message,
                type,
            },
        })
    );

};


export default Toast;