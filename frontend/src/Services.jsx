import React, { useEffect, useState } from "react";

export default function Services() {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", price: "" });
    const [error, setError] = useState("");

    async function load() {
        const res = await fetch("/api/services");
        setServices(await res.json());
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, price: Number(form.price) })
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Error al crear servicio");
            return;
        }
        setForm({ name: "", description: "", price: "" });
        load();
    }

    async function handleDelete(id) {
        await fetch(`/api/services/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="panel">
            <h2>Servicios</h2>
            <p style={{ fontSize: 13, color: "#64748b" }}>
                Estos datos viven en memoria del backend y se reinician si el contenedor se reinicia.
            </p>
            {error && <div className="error">{error}</div>}
            <form className="inline" onSubmit={handleSubmit}>
                <input
                    placeholder="Nombre del servicio"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Descripcion"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                    placeholder="Precio"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />
                <button type="submit">Crear</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.description}</td>
                            <td>${Number(s.price).toFixed(2)}</td>
                            <td>
                                <button className="danger" onClick={() => handleDelete(s.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
