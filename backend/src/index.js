const express = require("express");
const cors = require("cors");
const pool = require("./db");

const usersRouter = require("./routes/users");
const purchasesRouter = require("./routes/purchases");
const servicesRouter = require("./routes/services");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ status: "ok", database: "connected" });
    } catch (err) {
        res.status(503).json({ status: "error", database: "disconnected" });
    }
});

app.use("/users", usersRouter);
app.use("/purchases", purchasesRouter);
app.use("/services", servicesRouter);

app.listen(PORT, () => {
    console.log(`Backend escuchando en el puerto ${PORT}`);
});
