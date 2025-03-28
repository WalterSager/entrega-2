const CartManager = require("../managers/CartManager");
const Cart = require("../models/Cart");
const cartManager = new CartManager();

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    console.error("Error en getAllCarts:", error.message);
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error en getCartById:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error en createCart:", error.message);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error en addProductToCart:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  const { cid } = req.params;
  const newProducts = req.body;

  try {
    const updatedCart = await cartManager.updateCart(cid, newProducts);
    res.json({
      message: "Carrito actualizado correctamente",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    res.json({
      message: `Producto ID ${pid} eliminado del carrito ID ${cid}`,
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json({
      message: "Cantidad actualizada correctamente",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.clearCart(cid);
    res.json({ message: "Carrito vaciado correctamente", cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const deleted = await Cart.findByIdAndDelete(cid);

    if (!deleted) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ message: "Carrito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar carrito:", error.message);
    res.status(500).json({ error: "Error al eliminar carrito" });
  }
};




module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  deleteCart,
};
