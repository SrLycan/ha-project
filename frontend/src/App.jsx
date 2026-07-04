import React, { useState } from "react";
import Users from "./Users.jsx";
import Purchases from "./Purchases.jsx";
import Services from "./Services.jsx";
import MonitorStatus from "./MonitorStatus.jsx";
import { useTheme } from "./useTheme.js";

export default function App() {
    const [tab, setTab] = useState("users");
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="app">
            <div className="app-header">
                <h1>Panel Admin - Startup</h1>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
                </button>
            </div>

            <div className="tabs">
                <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>
                    Usuarios
                </button>
                <button
                    className={tab === "purchases" ? "active" : ""}
                    onClick={() => setTab("purchases")}
                >
                    Compras
                </button>
                <button
                    className={tab === "services" ? "active" : ""}
                    onClick={() => setTab("services")}
                >
                    Servicios
                </button>
            </div>

            {tab === "users" && <Users />}
            {tab === "purchases" && <Purchases />}
            {tab === "services" && <Services />}

            <MonitorStatus />
        </div>
    );
}
