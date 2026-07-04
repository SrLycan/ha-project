import React, { useEffect, useState } from "react";
import { ShoppingCart, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "./ToastContext.jsx";

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ user_id: "", product_name: "", amount: "" });
    const [error, setError] = useState("");
    const toast = useToast();

    async function load() {
        try {
            const [pRes, uRes] = await Promise.all([fetch("/api/purchases"), fetch("/api/users")]);
            setPurchases(await pRes.json());
            setUsers(await uRes.json());
        } catch (err) {
            toast.error("No se pudo cargar la información de compras");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/purchases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, amount: Number(form.amount) })
            });
            if (!res.ok) {
                const data = await res.json();
                const message = data.error || "Error al registrar compra";
                setError(message);
                toast.error(message);
                return;
            }
            setForm({ user_id: "", product_name: "", amount: "" });
            toast.success("Compra registrada correctamente");
            load();
        } catch (err) {
            const message = "No se pudo conectar con el servidor";
            setError(message);
            toast.error(message);
        }
    }

    async function handleDelete(id, product) {
        try {
            const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("No se pudo eliminar la compra");
                return;
            }
            toast.success(`Compra "${product}" eliminada`);
            load();
        } catch (err) {
            toast.error("No se pudo conectar con el servidor");
        }
    }

    const total = purchases.reduce((acc, p) => acc + Number(p.amount), 0);

    return (
        <div className="panel">
            <div className="panel-title-row">
                <h2>
                    <ShoppingCart size={20} strokeWidth={2.2} />
                    Compras
                </h2>
                <span className="count-pill mono">${total.toFixed(2)}</span>
            </div>
            {error && <div className="error">{error}</div>}
            <form className="inline" onSubmit={handleSubmit}>
                <select
                    value={form.user_id}
                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                    required
                >
                    <option value="">Seleccionar usuario</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                        </option>
                    ))}
                </select>
                <input
                    placeholder="Producto"
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    required
                />
                <input
                    placeholder="Monto"
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                />
                <button type="submit">
                    <PlusCircle size={16} />
                    Registrar
                </button>
            </form>
            {purchases.length === 0 ? (
                <div className="empty-state">
                    <ShoppingCart size={28} strokeWidth={1.6} />
                    <p>Todavía no hay compras registradas.</p>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Producto</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((p) => (
                            <tr key={p.id}>
                                <td>{p.user_name}</td>
                                <td>{p.product_name}</td>
                                <td className="mono">${Number(p.amount).toFixed(2)}</td>
                                <td className="mono">{new Date(p.purchase_date).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <button
                                        className="icon-btn danger"
                                        title="Eliminar compra"
                                        onClick={() => handleDelete(p.id, p.product_name)}
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
