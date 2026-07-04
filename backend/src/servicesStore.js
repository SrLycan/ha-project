let services = [];
let nextId = 1;

function list() {
    return services;
}

function create(data) {
    const service = {
        id: nextId++,
        name: data.name,
        description: data.description || "",
        price: data.price,
        created_at: new Date().toISOString()
    };
    services.push(service);
    return service;
}

function update(id, data) {
    const index = services.findIndex((s) => s.id === Number(id));
    if (index === -1) return null;
    services[index] = { ...services[index], ...data };
    return services[index];
}

function remove(id) {
    const index = services.findIndex((s) => s.id === Number(id));
    if (index === -1) return false;
    services.splice(index, 1);
    return true;
}

module.exports = { list, create, update, remove };
