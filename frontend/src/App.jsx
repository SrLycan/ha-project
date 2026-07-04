import React, { useState } from "react";
import Users from "./Users.jsx";
import Purchases from "./Purchases.jsx";
import Services from "./Services.jsx";

export default function App() {
    const [tab, setTab] = useState("users");

    return (
        <div className="app">
            <h1>Panel Admin - Startup</h1>
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

            <a
                className="link-external"
                href={`http://${window.location.hostname}:8080`}
                target="_blank"
                rel="noreferrer"
            >
                Ver dashboard de monitoreo (SLI) →
            </a>
        </div>
    );
}
