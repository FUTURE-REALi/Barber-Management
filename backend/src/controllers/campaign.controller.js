import Campaign from "../models/campaign.model.js";

export const createCampaign = async (req, res) => {
  const storeId = req.store?._id;
  const { service, budget, duration } = req.body;
  if (!service || !budget || !duration) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const campaign = await Campaign.create({
      store: storeId,
      service,
      budget,
      duration,
      paymentStatus: "pending" // Set to "pending" if you want to integrate real payment
    });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};