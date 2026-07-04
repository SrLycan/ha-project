import { useEffect, useState } from "react";

export function useMonitorMetrics(intervalMs = 5000) {
    const [metrics, setMetrics] = useState(null);
    const [reachable, setReachable] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch("/monitor/api/metrics", {
                    signal: AbortSignal.timeout(3000)
                });
                if (!res.ok) throw new Error("bad response");
                const data = await res.json();
                if (!cancelled) {
                    setMetrics(data);
                    setReachable(true);
                }
            } catch (err) {
                if (!cancelled) setReachable(false);
            }
        }

        load();
        const interval = setInterval(load, intervalMs);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [intervalMs]);

    const status = metrics?.last_check ? (metrics.last_check.ok ? "ok" : "fail") : "unknown";

    return { metrics, reachable, status };
}
