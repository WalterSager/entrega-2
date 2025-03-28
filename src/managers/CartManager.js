const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

class CartManager {
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error("Error al crear carrito:", error.message);
      throw new Error("No se pudo crear el carrito");
    }
  }

  async getCarts() {
    try {
      return await Cart.find();
    } catch (error) {
      console.error("Error al obtener carritos:", error.message);
      throw new Error("No se pudieron obtener los carritos");
    }
  }

  async getCartById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

      let cart = await Cart.findById(id).populate("products.product");
      if (!cart) throw new Error("Carrito no encontrado");

      // Filtrar productos cuyo product es null (producto eliminado de la DB)
      cart.products = cart.products.filter(p => p.product !== null);
      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error al obtener carrito por ID:", error.message);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("ID de carrito o producto inválido");
      }

      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const product = await Product.findById(productId);
      if (!product) throw new Error("Producto no encontrado");

      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
  
      const index = cart.products.findIndex(p => p.product.toString() === productId);
      if (index === -1) throw new Error("Producto no encontrado en el carrito");
  
      if (cart.products[index].quantity > 1) {
        cart.products[index].quantity -= 1;
      } else {
        cart.products.splice(index, 1);
      }
  
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error.message);
      throw error;
    }
  }

  async updateCart(cartId, newProducts) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
  
      if (!Array.isArray(newProducts)) {
        throw new Error("El formato debe ser un arreglo de productos");
      }
  
      for (const prod of newProducts) {
        if (!prod.product || typeof prod.quantity !== "number") {
          throw new Error("Cada producto debe tener 'product' y 'quantity'");
        }
      }
  
      cart.products = newProducts;
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar carrito:", error.message);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (isNaN(quantity) || quantity < 1) {
        throw new Error("La cantidad debe ser un número mayor o igual a 1");
      }
  
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
  
      const index = cart.products.findIndex(p => p.product.toString() === productId);
      if (index === -1) throw new Error("Producto no encontrado en el carrito");
  
      cart.products[index].quantity = quantity;
  
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar cantidad del producto:", error.message);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");
  
      cart.products = [];
      await cart.save();
  
      return cart;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error.message);
      throw error;
    }
  }  

  async deleteAllProducts(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error.message);
      throw error;
    }
  }
}

module.exports = CartManager;
