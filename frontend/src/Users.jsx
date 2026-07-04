import React, { useEffect, useState } from "react";
import { UserPlus, Trash2, Users as UsersIcon } from "lucide-react";
import { useToast } from "./ToastContext.jsx";

function initials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

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

    async function handleDelete(id, name) {
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("No se pudo eliminar el usuario");
                return;
            }
            toast.success(`Usuario "${name}" eliminado`);
            load();
        } catch (err) {
            toast.error("No se pudo conectar con el servidor");
        }
    }

    return (
        <div className="panel">
            <div className="panel-title-row">
                <h2>
                    <UsersIcon size={20} strokeWidth={2.2} />
                    Usuarios
                </h2>
                <span className="count-pill">{users.length}</span>
            </div>
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
                <button type="submit">
                    <UserPlus size={16} />
                    Crear
                </button>
            </form>
            {users.length === 0 ? (
                <div className="empty-state">
                    <UsersIcon size={28} strokeWidth={1.6} />
                    <p>Todavía no hay usuarios registrados. Crea el primero arriba.</p>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Creado</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <div className="user-cell">
                                        <span className="avatar">{initials(u.name) || "?"}</span>
                                        <div>
                                            <div className="user-name">{u.name}</div>
                                            <div className="user-id">#{u.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`badge badge-${u.role}`}>{u.role === "admin" ? "Admin" : "Cliente"}</span>
                                </td>
                                <td className="mono">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <button
                                        className="icon-btn danger"
                                        title="Eliminar usuario"
                                        onClick={() => handleDelete(u.id, u.name)}
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
