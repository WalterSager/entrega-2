const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager();

const getAllProducts = async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        console.error("Error en getAllProducts:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error en getProductById:", error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};

const createProduct = async (req, res) => {
    try {
        console.log("Body:", req.body);
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error en createProduct:", error);
        res.status(400).json({ error: "Error al agregar producto. Verifica el formato del JSON." });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(Number(req.params.pid), req.body);
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error en updateProduct:", error);
        res.status(400).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        console.log("Recibiendo solicitud para eliminar producto ID:", pid); 

        const result = await productManager.deleteProduct(parseInt(pid));
        
        if (!result) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: `Producto ID ${pid} eliminado correctamente` });

    } catch (error) {
        console.error("Error en DELETE /api/products/:pid", error);
        res.status(400).json({ error: "Error al eliminar el producto" });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
