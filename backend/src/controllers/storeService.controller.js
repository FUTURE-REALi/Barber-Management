import StoreService from '../models/storeService.model.js';
import storeModel from '../models/store.model.js';

export const addStoreService = async (req, res) => {
  const storeId = req.store?._id; // comes from authStore middleware
  const { service, price, duration } = req.body;
  console.log("[addStoreService] storeId:", storeId, "service:", service, "price:", price, "duration:", duration);

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
    const {store} = req.params;
    if(!store) {
        return res.status(400).json({message: 'Store ID is required'});
    }
    try {
        const services = await StoreService.find({store})
            .populate('service', 'name description')
            .select('price duration service');
        return res.status(200).json(services);
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
}