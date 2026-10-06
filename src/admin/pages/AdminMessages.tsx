import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

import {
    getContactMessages,
    deleteContactMessage,
    type ContactMessage,
} from "../services/contactService";

import { showToast } from "../components/Toast";


function AdminMessages() {

    const [messages, setMessages] =
        useState<ContactMessage[]>([]);

    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [deletingId, setDeletingId] =
        useState<number | null>(null);


    // ========================================
    // LOAD MESSAGES
    // ========================================

    const loadMessages = async () => {

        try {

            setLoading(true);

            const data =
                await getContactMessages();

            setMessages(data);

        } catch (error: any) {

            console.error(
                "Load messages error:",
                error
            );

            showToast(
                error.response?.data?.message ||
                "Unable to load messages",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadMessages();

    }, []);


    // ========================================
    // DELETE MESSAGE
    // ========================================

    const handleDelete = async (
        id: number
    ) => {

        if (deletingId !== null) {
            return;
        }

        try {

            setDeletingId(id);

            console.log(
                "Deleting contact message:",
                id
            );

            await deleteContactMessage(id);

            setMessages((previous) =>
                previous.filter(
                    (message) =>
                        message.id !== id
                )
            );

            if (
                selectedMessage &&
                selectedMessage.id === id
            ) {
                setSelectedMessage(null);
            }

            showToast(
                "Message deleted successfully",
                "success"
            );

        } catch (error: any) {

            console.error(
                "Delete message error:",
                error
            );

            console.error(
                "Delete response:",
                error.response
            );

            showToast(
                error.response?.data?.message ||
                "Unable to delete message",
                "error"
            );

        } finally {

            setDeletingId(null);

        }

    };


    // ========================================
    // DATE FORMAT
    // ========================================

    const formatDate = (
        date: string
    ) => {

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="admin-background">

                <AdminSidebar />

                <main className="admin-main">

                    <div className="admin-content">

                        <p className="admin-page-description">
                            Loading messages...
                        </p>

                    </div>

                </main>

            </div>

        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="admin-background">

            <AdminSidebar />

            <main className="admin-main">

                <div className="admin-content">


                    {/* ==================================
                        PAGE HEADER
                    ================================== */}

                    <header className="admin-page-header">

                        <div className="admin-page-label">

                            <span>
                                CMS / 08
                            </span>

                        </div>

                        <h1 className="admin-page-title">
                            Messages
                        </h1>

                        <p className="admin-page-description">
                            View and manage messages
                            submitted through your portfolio.
                        </p>

                    </header>


                    {/* ==================================
                        MESSAGE COUNT
                    ================================== */}

                    <div className="messages-summary">

                        <span>
                            TOTAL MESSAGES
                        </span>

                        <strong>
                            {messages.length}
                        </strong>

                    </div>


                    {/* ==================================
                        EMPTY STATE
                    ================================== */}

                    {messages.length === 0 && (

                        <div className="messages-empty">

                            <p>
                                No messages yet.
                            </p>

                            <span>
                                Messages submitted
                                through your portfolio
                                will appear here.
                            </span>

                        </div>

                    )}


                    {/* ==================================
                        MESSAGE TABLE
                    ================================== */}

                    {messages.length > 0 && (

                        <div className="messages-table-wrapper">

                            <table className="messages-table">

                                <thead>

                                    <tr>

                                        <th>
                                            NAME
                                        </th>

                                        <th>
                                            EMAIL
                                        </th>

                                        <th>
                                            SUBJECT
                                        </th>

                                        <th>
                                            DATE
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {messages.map(
                                        (message) => (

                                            <tr
                                                key={
                                                    message.id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {
                                                            message.name
                                                        }
                                                    </strong>

                                                </td>


                                                <td>

                                                    <a
                                                        href={`mailto:${message.email}`}
                                                        className="message-email"
                                                    >
                                                        {
                                                            message.email
                                                        }
                                                    </a>

                                                </td>


                                                <td>

                                                    {
                                                        message.subject ||
                                                        "No subject"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatDate(
                                                            message.createdAt
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    <div className="message-actions">

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            className="admin-button"
                                                            onClick={() =>
                                                                setSelectedMessage(
                                                                    message
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="admin-button admin-button-danger"
                                                            disabled={
                                                                deletingId ===
                                                                message.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    message.id
                                                                )
                                                            }
                                                        >

                                                            {deletingId ===
                                                            message.id
                                                                ? "Deleting..."
                                                                : "Delete"}

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* ==================================
                        MESSAGE DETAILS
                    ================================== */}

                    {selectedMessage && (

                        <div className="message-detail">


                            <div className="message-detail-header">

                                <div>

                                    <span className="message-detail-label">
                                        MESSAGE
                                    </span>

                                    <h2>
                                        {
                                            selectedMessage.subject ||
                                            "No subject"
                                        }
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="message-close"
                                    onClick={() =>
                                        setSelectedMessage(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <div className="message-detail-meta">

                                <div>

                                    <span>
                                        FROM
                                    </span>

                                    <strong>
                                        {
                                            selectedMessage.name
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        EMAIL
                                    </span>

                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                    >
                                        {
                                            selectedMessage.email
                                        }
                                    </a>

                                </div>


                                <div>

                                    <span>
                                        RECEIVED
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                selectedMessage.createdAt
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="message-detail-content">

                                <span>
                                    MESSAGE
                                </span>

                                <p>
                                    {
                                        selectedMessage.message
                                    }
                                </p>

                            </div>


                            <div className="message-detail-actions">

                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="admin-button"
                                >
                                    Reply via Email ↗
                                </a>


                                <button
                                    type="button"
                                    className="admin-button admin-button-danger"
                                    disabled={
                                        deletingId ===
                                        selectedMessage.id
                                    }
                                    onClick={() =>
                                        handleDelete(
                                            selectedMessage.id
                                        )
                                    }
                                >

                                    {deletingId ===
                                    selectedMessage.id
                                        ? "Deleting..."
                                        : "Delete Message"}

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>

    );

}


export default AdminMessages;