const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getAllCarts);
router.get("/:cid", cartController.getCartById);
router.post("/", cartController.createCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);

module.exports = router;
