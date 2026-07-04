import React from "react";
import { Activity, Gauge, Timer, Layers, AlertTriangle } from "lucide-react";
import { useMonitorMetrics } from "./useMonitorMetrics.js";

export default function MonitorStatus() {
    const { metrics, reachable, status } = useMonitorMetrics();

    return (
        <div className="panel">
            <div className="panel-title-row">
                <h2>
                    <Activity size={20} strokeWidth={2.2} />
                    Monitoreo (SLI)
                </h2>
                <span className={`led led-${status}`} title={`Estado: ${status}`}></span>
            </div>
            <p className="hint">
                Mide cada 5 segundos la latencia del endpoint de salud del backend y calcula el
                porcentaje de peticiones que cumplen el objetivo de nivel de servicio (SLO).
                Es la evidencia de que el sistema está siendo observado en tiempo real.
            </p>

            {reachable === false && (
                <div className="error">
                    <AlertTriangle size={16} />
                    <span>
                        No se pudo conectar al monitor. Revisa que el contenedor{" "}
                        <code>startup_monitor</code> esté corriendo (<code>docker compose ps</code>)
                        y que nginx tenga la ruta <code>/monitor/</code> configurada.
                    </span>
                </div>
            )}

            {metrics && (
                <div className="monitor-grid">
                    <div className="monitor-metric">
                        <div className="label">
                            <Gauge size={13} /> SLI actual
                        </div>
                        <div className="value">{metrics.sli_percentage ?? "N/A"}%</div>
                    </div>
                    <div className="monitor-metric">
                        <div className="label">
                            <Timer size={13} /> Latencia prom.
                        </div>
                        <div className="value">{metrics.avg_latency_ms ?? "N/A"} ms</div>
                    </div>
                    <div className="monitor-metric">
                        <div className="label">
                            <AlertTriangle size={13} /> Umbral (SLO)
                        </div>
                        <div className="value">&lt; {metrics.threshold_ms} ms</div>
                    </div>
                    <div className="monitor-metric">
                        <div className="label">
                            <Layers size={13} /> Muestras
                        </div>
                        <div className="value">{metrics.total_checks}</div>
                    </div>
                </div>
            )}

            <a className="link-external" href="/monitor/" target="_blank" rel="noreferrer">
                Ver dashboard completo →
            </a>
        </div>
    );
}
