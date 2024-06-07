import express from "express";
import morgan from "morgan";
import cors from "cors";

import offerRoutes from "./routes/offer.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/offers", offerRoutes);

export default app;
