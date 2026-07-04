import React, { useEffect, useState } from "react";
import { useToast } from "./ToastContext.jsx";

export default function Services() {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", price: "" });
    const [error, setError] = useState("");
    const toast = useToast();

    async function load() {
        try {
            const res = await fetch("/api/services");
            setServices(await res.json());
        } catch (err) {
            toast.error("No se pudo cargar la lista de servicios");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, price: Number(form.price) })
            });
            if (!res.ok) {
                const data = await res.json();
                const message = data.error || "Error al crear servicio";
                setError(message);
                toast.error(message);
                return;
            }
            setForm({ name: "", description: "", price: "" });
            toast.success("Servicio agregado correctamente");
            load();
        } catch (err) {
            const message = "No se pudo conectar con el servidor";
            setError(message);
            toast.error(message);
        }
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("No se pudo eliminar el servicio");
                return;
            }
            toast.success("Servicio eliminado");
            load();
        } catch (err) {
            toast.error("No se pudo conectar con el servidor");
        }
    }

    return (
        <div className="panel">
            <h2>Servicios</h2>
            <p className="hint">
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
            {services.length === 0 ? (
                <p className="empty-state">Todavía no hay servicios registrados.</p>
            ) : (
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
            )}
        </div>
    );
}
