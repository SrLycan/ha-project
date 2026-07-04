import React, { useEffect, useState } from "react";

export default function MonitorStatus() {
    const [metrics, setMetrics] = useState(null);
    const [reachable, setReachable] = useState(null);

    const monitorUrl = "/monitor/";

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${monitorUrl}api/metrics`, {
                    signal: AbortSignal.timeout(3000)
                });
                if (!res.ok) throw new Error("bad response");
                const data = await res.json();
                if (!cancelled) {
                    setMetrics(data);
                    setReachable(true);
                }
            } catch (err) {
                if (!cancelled) {
                    setReachable(false);
                }
            }
        }

        load();
        const interval = setInterval(load, 5000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [monitorUrl]);

    const status = metrics?.last_check ? (metrics.last_check.ok ? "ok" : "fail") : "unknown";

    return (
        <div className="monitor-card">
            <h3>
                <span className={`status-dot ${status}`}></span>
                Monitor de disponibilidad (SLI)
            </h3>
            <p className="hint">
                Mide cada 5s la latencia del backend y calcula el porcentaje de peticiones que
                cumplen el objetivo de nivel de servicio (SLO). Sirve para demostrar que el
                sistema está siendo observado en tiempo real.
            </p>

            {reachable === false && (
                <div className="error">
                    No se pudo conectar al monitor. Revisa que el contenedor{" "}
                    <code>startup_monitor</code> esté corriendo (<code>docker compose ps</code>)
                    y que nginx tenga la ruta <code>/monitor/</code> configurada (revisa{" "}
                    <code>docker compose logs frontend</code>).
                </div>
            )}

            {metrics && (
                <div className="monitor-grid">
                    <div className="monitor-metric">
                        <div className="label">SLI actual</div>
                        <div className="value">{metrics.sli_percentage ?? "N/A"}%</div>
                    </div>
                    <div className="monitor-metric">
                        <div className="label">Latencia prom.</div>
                        <div className="value">{metrics.avg_latency_ms ?? "N/A"} ms</div>
                    </div>
                    <div className="monitor-metric">
                        <div className="label">Umbral (SLO)</div>
                        <div className="value">&lt; {metrics.threshold_ms} ms</div>
                    </div>
                    <div className="monitor-metric">
                        <div className="label">Muestras</div>
                        <div className="value">{metrics.total_checks}</div>
                    </div>
                </div>
            )}

            <a className="link-external" href={monitorUrl} target="_blank" rel="noreferrer">
                Ver dashboard completo →
            </a>
        </div>
    );
}
