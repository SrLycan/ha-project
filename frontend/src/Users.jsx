import React, { useEffect, useState } from "react";
import { useToast } from "./ToastContext.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
    const [error, setError] = useState("");
    const toast = useToast();

    async function load() {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            toast.error("No se pudo cargar la lista de usuarios");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (!res.ok) {
                const data = await res.json();
                const message = data.error || "Error al crear usuario";
                setError(message);
                toast.error(message);
                return;
            }
            setForm({ name: "", email: "", password: "", role: "client" });
            toast.success("Usuario agregado correctamente");
            load();
        } catch (err) {
            const message = "No se pudo conectar con el servidor";
            setError(message);
            toast.error(message);
        }
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("No se pudo eliminar el usuario");
                return;
            }
            toast.success("Usuario eliminado");
            load();
        } catch (err) {
            toast.error("No se pudo conectar con el servidor");
        }
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
            {users.length === 0 ? (
                <p className="empty-state">Todavía no hay usuarios registrados.</p>
            ) : (
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
            )}
        </div>
    );
}




///test