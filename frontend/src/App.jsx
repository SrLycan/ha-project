import React, { useState } from "react";
import { Users as UsersIcon, ShoppingCart, Package, Activity, Moon, Sun, Boxes } from "lucide-react";
import Users from "./Users.jsx";
import Purchases from "./Purchases.jsx";
import Services from "./Services.jsx";
import MonitorStatus from "./MonitorStatus.jsx";
import SidebarStatus from "./SidebarStatus.jsx";
import { useTheme } from "./useTheme.js";

const NAV_ITEMS = [
    { id: "users", label: "Usuarios", icon: UsersIcon },
    { id: "purchases", label: "Compras", icon: ShoppingCart },
    { id: "services", label: "Servicios", icon: Package },
    { id: "monitor", label: "Monitoreo", icon: Activity }
];

export default function App() {
    const [tab, setTab] = useState("users");
    const { theme, toggleTheme } = useTheme();

    const activeItem = NAV_ITEMS.find((item) => item.id === tab);

    return (
        <div className="shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-mark">
                        <Boxes size={20} strokeWidth={2.4} />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">Startup HA</span>
                        <span className="brand-subtitle">Panel de operaciones</span>
                    </div>
                </div>

                <nav className="nav">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${tab === item.id ? "active" : ""}`}
                                onClick={() => setTab(item.id)}
                            >
                                <Icon size={18} strokeWidth={2.1} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <SidebarStatus />
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
                    </button>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <h1>{activeItem?.label}</h1>
                </header>

                <div className="content" key={tab}>
                    {tab === "users" && <Users />}
                    {tab === "purchases" && <Purchases />}
                    {tab === "services" && <Services />}
                    {tab === "monitor" && <MonitorStatus />}
                </div>
            </main>
        </div>
    );
}
