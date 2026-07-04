const http = require("http");

const TARGET_URL = process.env.TARGET_URL || "http://backend:3000/health";
const SLI_THRESHOLD_MS = Number(process.env.SLI_THRESHOLD_MS || 500);
const CHECK_INTERVAL_MS = 5000;
const MAX_SAMPLES = 100;

const samples = [];

async function checkTarget() {
    const start = Date.now();
    let ok = false;
    let latency = null;
    try {
        const response = await fetch(TARGET_URL, { signal: AbortSignal.timeout(4000) });
        latency = Date.now() - start;
        ok = response.ok;
    } catch (err) {
        latency = Date.now() - start;
        ok = false;
    }
    samples.push({ timestamp: new Date().toISOString(), ok, latency });
    if (samples.length > MAX_SAMPLES) {
        samples.shift();
    }
}

setInterval(checkTarget, CHECK_INTERVAL_MS);
checkTarget();

function computeMetrics() {
    if (samples.length === 0) {
        return {
            total_checks: 0,
            sli_percentage: null,
            avg_latency_ms: null,
            last_check: null,
            target: TARGET_URL,
            threshold_ms: SLI_THRESHOLD_MS
        };
    }
    const withinThreshold = samples.filter((s) => s.ok && s.latency <= SLI_THRESHOLD_MS);
    const avgLatency =
        samples.reduce((acc, s) => acc + s.latency, 0) / samples.length;
    return {
        total_checks: samples.length,
        sli_percentage: Number(((withinThreshold.length / samples.length) * 100).toFixed(2)),
        avg_latency_ms: Number(avgLatency.toFixed(2)),
        last_check: samples[samples.length - 1],
        target: TARGET_URL,
        threshold_ms: SLI_THRESHOLD_MS
    };
}

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>SLI Dashboard</title>
<style>
body { font-family: Arial, sans-serif; background:#0f172a; color:#e2e8f0; margin:0; padding:40px; }
.card { background:#1e293b; border-radius:12px; padding:24px; max-width:480px; margin:0 auto 20px auto; }
h1 { text-align:center; }
.metric { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #334155; }
.value { font-weight:bold; }
.ok { color:#22c55e; }
.fail { color:#ef4444; }
</style>
</head>
<body>
<h1>SLI Dashboard</h1>
<div class="card" id="card">Cargando...</div>
<script>
async function refresh() {
    const res = await fetch("/api/metrics");
    const data = await res.json();
    const status = data.last_check ? (data.last_check.ok ? "OK" : "FAIL") : "N/A";
    const statusClass = data.last_check ? (data.last_check.ok ? "ok" : "fail") : "";
    document.getElementById("card").innerHTML = \`
        <div class="metric"><span>Objetivo (SLO)</span><span class="value">&lt; \${data.threshold_ms} ms</span></div>
        <div class="metric"><span>SLI actual</span><span class="value">\${data.sli_percentage ?? "N/A"}%</span></div>
        <div class="metric"><span>Latencia promedio</span><span class="value">\${data.avg_latency_ms ?? "N/A"} ms</span></div>
        <div class="metric"><span>Ultimo chequeo</span><span class="value \${statusClass}">\${status}</span></div>
        <div class="metric"><span>Muestras</span><span class="value">\${data.total_checks}</span></div>
        <div class="metric"><span>Destino</span><span class="value">\${data.target}</span></div>
    \`;
}
refresh();
setInterval(refresh, 3000);
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    if (req.url === "/api/metrics") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(computeMetrics()));
        return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(DASHBOARD_HTML);
});

server.listen(8080, () => {
    console.log("Monitor SLI escuchando en el puerto 8080");
});
