import React from "react";
import { useMonitorMetrics } from "./useMonitorMetrics.js";

const LABELS = {
    ok: "Operativo",
    fail: "Con fallas",
    unknown: "Sin datos"
};

export default function SidebarStatus() {
    const { metrics, status } = useMonitorMetrics(8000);

    return (
        <div className="sidebar-status">
            <span className={`led led-${status}`}></span>
            <div className="sidebar-status-text">
                <span className="sidebar-status-label">{LABELS[status]}</span>
                <span className="sidebar-status-value">
                    {metrics ? `${metrics.sli_percentage ?? "—"}% SLI` : "conectando…"}
                </span>
            </div>
        </div>
    );
}
