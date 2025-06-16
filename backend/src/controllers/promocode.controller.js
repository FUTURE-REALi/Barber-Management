import Promocode from "../models/promocode.model.js";

export const createPromocode = async (req, res) => {
  const storeId = req.store?._id;
  const { code, discount, expiry } = req.body;
  if (!code || !discount || !expiry) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const exists = await Promocode.findOne({ code });
    if (exists) {
      return res.status(400).json({ error: "Promocode already exists" });
    }
    const promo = await Promocode.create({
      code,
      store: storeId,
      discount,
      expiry
    });
    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};