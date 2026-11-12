import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { eventsRouter } from "./routes/events.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/events", eventsRouter);

// Si une route va planter, on renvoie une erreur propre au lieu de faire planter le serveur
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`API Sudettes sur http://localhost:${PORT}`);
});