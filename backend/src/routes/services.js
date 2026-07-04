const express = require("express");
const store = require("../servicesStore");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(store.list());
});

router.post("/", (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: "name y price son requeridos" });
    }
    const service = store.create(req.body);
    res.status(201).json(service);
});

router.put("/:id", (req, res) => {
    const service = store.update(req.params.id, req.body);
    if (!service) {
        return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json(service);
});

router.delete("/:id", (req, res) => {
    const deleted = store.remove(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json({ deleted: true });
});

module.exports = router;
