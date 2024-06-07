import Offer from "../models/offer.model.js";
import axios from "axios";
import { USER_SERVICE_URI } from "../config.js";

export const createOffer = async (req, res) => {
  try {
    const { companyId, ...offerData } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const company = await axios.get(
      `${USER_SERVICE_URI}/api/companies/${companyId}`
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const offer = new Offer({ ...offerData, company: companyId });
    await offer.save();

    await axios.patch(
      `${USER_SERVICE_URI}/api/companies/${companyId}/offers/`,
      {
        offerId: offer._id,
      }
    );

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOffers = async (req, res) => {
  const { page, limit, searchTerm } = req.query;

  const skips = limit * (page - 1);

  try {
    let query = Offer.find().lean();

    if (searchTerm) {
      query = query.find({
        $or: [
          { position: { $regex: searchTerm, $options: "i" } },
          { "location.city": { $regex: searchTerm, $options: "i" } },
          { "location.country": { $regex: searchTerm, $options: "i" } },
          { "skills.skill": { $regex: searchTerm, $options: "i" } },
          { level: { $regex: searchTerm, $options: "i" } },
        ],
      });
    }

    const totalOffers = await Offer.countDocuments(query);
    const offers = await query.skip(skips).limit(limit);

    if (!offers) {
      return res.status(404).json({ message: "Offers not found" });
    }

    const offersWithCompany = await Promise.all(
      offers.map(async (offer) => {
        const company = await axios.get(
          `${USER_SERVICE_URI}/api/companies/${offer.company}`
        );
        return { ...offer, company: company.data };
      })
    );

    res.status(200).json({ offers: offersWithCompany, totalOffers });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).lean();
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    await axios.delete(
      `${USER_SERVICE_URI}/api/companies/${offer.company}/offers/${offer._id}`
    );
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
