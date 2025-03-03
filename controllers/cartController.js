const CartManager = require("../managers/CartManager");
const cartManager = new CartManager();

const getAllCarts = async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error("Error en getAllCarts:", error);
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
};

const getCartById = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(Number(req.params.cid));
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        console.error("Error en getCartById:", error);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
};

const createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error en createCart:", error);
        res.status(500).json({ error: "Error al crear el carrito" });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params; 
        const updatedCart = await cartManager.addProductToCart(Number(cid), Number(pid));
        res.json(updatedCart);
    } catch (error) {
        console.error("Error en addProductToCart:", error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllCarts,
    getCartById,
    createCart,
    addProductToCart
};
