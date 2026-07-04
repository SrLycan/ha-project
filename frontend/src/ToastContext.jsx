import React, { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (message, type) => {
            const id = ++idRef.current;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => remove(id), 4000);
        },
        [remove]
    );

    const api = {
        success: (msg) => push(msg, "success"),
        error: (msg) => push(msg, "error"),
        info: (msg) => push(msg, "info")
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="toast-container" role="status" aria-live="polite">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast toast-${t.type}`}
                        onClick={() => remove(t.id)}
                    >
                        <span className="toast-icon">
                            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
                        </span>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast debe usarse dentro de <ToastProvider>");
    }
    return ctx;
}
