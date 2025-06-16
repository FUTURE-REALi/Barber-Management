import StoreService from '../models/storeService.model.js';
import storeModel from '../models/store.model.js';

export const addStoreService = async (req, res) => {
  const storeId = req.store?._id; // comes from authStore middleware
  const { service, price, duration } = req.body;
  console.log("[addStoreService] storeId:", storeId, "service:", service, "price:", price, "duration:", duration);

  console.log("[addStoreService] Request body:", req.body);
  console.log("[addStoreService] Request store:", req.store);
  if (!storeId || !service || price == null || duration == null) {
    console.log("[addStoreService] Store ID, service, price, or duration is missing");
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    let storeService = await StoreService.findOne({ store: storeId, service });
    console.log("[addStoreService] Checking for existing StoreService:", storeService);
    if (!storeService) {
      storeService = await StoreService.create({ store: storeId, service, price, duration });
      console.log("[addStoreService] StoreService created:", storeService);
      const storeDoc = await storeModel.findById(storeId);
      if (storeDoc && !storeDoc.services.includes(storeService._id)) {
        storeDoc.services.push(storeService._id);
        await storeDoc.save();
        console.log("[addStoreService] StoreService added to store.services:", storeDoc.services);
      }
    }
    const updatedStore = await storeModel.findById(storeId).populate('services');
    res.status(201).json({ ...storeService.toObject(), updatedStore });
  } catch (error) {
    console.log("[addStoreService] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getStoreServices = async (req, res) => {
  const {storeId} = req.params;
  if(!storeId) {
    return res.status(400).json({message: 'Store ID is required'});
  }
  try {
    const services = await StoreService.find({store: storeId})
      .populate('service', 'name description')
      .select('price duration service discount');
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

export const updateStoreService = async (req, res) => {
  const { serviceId } = req.params;
  const { price, description, discount } = req.body;
  if (!serviceId) {
    return res.status(400).json({ error: "Service ID is required" });
  }
  try {
    const storeService = await StoreService.findById(serviceId).populate('service');
    if (!storeService) {
      return res.status(404).json({ error: "Store service not found" });
    }
    if (price != null) storeService.price = price;
    if (discount != null) storeService.discount = discount;
    if (description) {
      storeService.service.description = description;
      await storeService.service.save();
    }
    await storeService.save();
    const updatedStoreService = await StoreService.findById(serviceId)
      .populate('service', 'name description');
    return res.status(200).json(updatedStoreService);
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}