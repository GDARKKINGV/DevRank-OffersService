import { Router } from "express";
import {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
} from "../controllers/offer.controller.js";

const router = Router();

router
  .post("/", createOffer)
  .get("/", getOffers)
  .get("/:id", getOfferById)
  .put("/:id", updateOffer)
  .delete("/:id", deleteOffer);

export default router;
