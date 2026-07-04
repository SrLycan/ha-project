import React, { useEffect, useState } from "react";

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ user_id: "", product_name: "", amount: "" });
    const [error, setError] = useState("");

    async function load() {
        const [pRes, uRes] = await Promise.all([fetch("/api/purchases"), fetch("/api/users")]);
        setPurchases(await pRes.json());
        setUsers(await uRes.json());
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, amount: Number(form.amount) })
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Error al registrar compra");
            return;
        }
        setForm({ user_id: "", product_name: "", amount: "" });
        load();
    }

    async function handleDelete(id) {
        await fetch(`/api/purchases/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="panel">
            <h2>Compras</h2>
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
                <button type="submit">Registrar</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
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
                            <td>{p.id}</td>
                            <td>{p.user_name}</td>
                            <td>{p.product_name}</td>
                            <td>${Number(p.amount).toFixed(2)}</td>
                            <td>{new Date(p.purchase_date).toLocaleString()}</td>
                            <td>
                                <button className="danger" onClick={() => handleDelete(p.id)}>
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
