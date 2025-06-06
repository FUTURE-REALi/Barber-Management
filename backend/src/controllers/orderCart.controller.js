import OrderCart from '../models/orderCart.model.js';

export const createOrderCart = async (req, res) => {
    const { user, store, items, totalPrice } = req.body;

    if (!user || !store || !items || !totalPrice) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const newOrderCart = new OrderCart({
            user,
            store,
            items,
            totalPrice
        });

        await newOrderCart.save();
        res.status(201).json(newOrderCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOrderCart = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Order Cart ID is required" });
    }

    try {
        const orderCart = await OrderCart.findByIdAndDelete(id);
        if (!orderCart) {
            return res.status(404).json({ message: "Order Cart not found" });
        }
        res.status(200).json({ message: "Order Cart deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getOrderCart = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const orderCart = await OrderCart.findOne({ user: userId }).populate('items.service');
        if (!orderCart) {
            return res.status(404).json({ message: "Order Cart not found" });
        }
        res.status(200).json(orderCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateOrderCart = async (req, res) => {
    const { id } = req.params;
    const { items, totalPrice } = req.body;

    if (!id || !items || !totalPrice) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const updatedOrderCart = await OrderCart.findByIdAndUpdate(id, { items, totalPrice }, { new: true });
        if (!updatedOrderCart) {
            return res.status(404).json({ message: "Order Cart not found" });
        }
        res.status(200).json(updatedOrderCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}