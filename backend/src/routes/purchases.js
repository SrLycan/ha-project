const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.id, p.product_name, p.amount, p.purchase_date, p.created_at,
                    u.id AS user_id, u.name AS user_name, u.email AS user_email
             FROM purchases p
             JOIN users u ON u.id = p.user_id
             ORDER BY p.id DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { user_id, product_name, amount } = req.body;
        if (!user_id || !product_name || amount === undefined) {
            return res
                .status(400)
                .json({ error: "user_id, product_name y amount son requeridos" });
        }
        const result = await pool.query(
            "INSERT INTO purchases (user_id, product_name, amount) VALUES ($1, $2, $3) RETURNING *",
            [user_id, product_name, amount]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23503") {
            return res.status(400).json({ error: "El usuario indicado no existe" });
        }
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { product_name, amount } = req.body;
        const result = await pool.query(
            `UPDATE purchases SET
                product_name = COALESCE($1, product_name),
                amount = COALESCE($2, amount)
             WHERE id = $3
             RETURNING *`,
            [product_name, amount, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM purchases WHERE id = $1 RETURNING id", [
            req.params.id
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }
        res.json({ deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
