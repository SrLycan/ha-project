import React, { useEffect, useState } from "react";
import { Package, PackagePlus, Trash2, Info } from "lucide-react";
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

    async function handleDelete(id, name) {
        try {
            const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("No se pudo eliminar el servicio");
                return;
            }
            toast.success(`Servicio "${name}" eliminado`);
            load();
        } catch (err) {
            toast.error("No se pudo conectar con el servidor");
        }
    }

    return (
        <div className="panel">
            <div className="panel-title-row">
                <h2>
                    <Package size={20} strokeWidth={2.2} />
                    Servicios
                </h2>
                <span className="count-pill">{services.length}</span>
            </div>
            <p className="hint">
                <Info size={13} />
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
                <button type="submit">
                    <PackagePlus size={16} />
                    Crear
                </button>
            </form>
            {services.length === 0 ? (
                <div className="empty-state">
                    <Package size={28} strokeWidth={1.6} />
                    <p>Todavía no hay servicios registrados.</p>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Precio</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.description}</td>
                                <td className="mono">${Number(s.price).toFixed(2)}</td>
                                <td className="actions-cell">
                                    <button
                                        className="icon-btn danger"
                                        title="Eliminar servicio"
                                        onClick={() => handleDelete(s.id, s.name)}
                                    >
                                        <Trash2 size={16} />
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
