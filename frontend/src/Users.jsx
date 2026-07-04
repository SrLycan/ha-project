import React, { useEffect, useState } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
    const [error, setError] = useState("");

    async function load() {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Error al crear usuario");
            return;
        }
        setForm({ name: "", email: "", password: "", role: "client" });
        load();
    }

    async function handleDelete(id) {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="panel">
            <h2>Usuarios</h2>
            {error && <div className="error">{error}</div>}
            <form className="inline" onSubmit={handleSubmit}>
                <input
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="client">Cliente</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Crear</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Creado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{new Date(u.created_at).toLocaleString()}</td>
                            <td>
                                <button className="danger" onClick={() => handleDelete(u.id)}>
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
