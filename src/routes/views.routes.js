const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
    };

    const filter = query
      ? {
          $or: [
            { category: { $regex: query, $options: "i" } },
            { title: { $regex: query, $options: "i" } },
            { status: query === "true" || query === "false" ? query === "true" : undefined }
          ],
        }
      : {};

    const result = await Product.paginate(filter, options);

    res.render("home", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
    });
  } catch (error) {
    console.error("Error en /products:", error.message);
    res.status(500).send("Error al cargar la vista de productos");
  }
});


router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    const cartId = "6489f15ac3b7de20fe2b9f13"; 

    res.render("productDetail", { product, cartId });
  } catch (error) {
    res.status(500).send("Error al cargar el producto");
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product").lean();
    res.render("cartList", { carts });
  } catch (error) {
    console.error("Error al cargar los carritos:", error.message);
    res.status(500).send("Error al cargar los carritos");
  }
});


router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart || !cart.products) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error("Error al cargar el carrito:", error.message);
    res.status(500).send("Error al cargar el carrito");
  }
});


module.exports = router;
