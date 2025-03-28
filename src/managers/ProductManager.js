const Product = require("../models/Product");
const mongoosePaginate = require("mongoose-paginate-v2");

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true,
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined
            };

            const filter = query ? {
                $or: [
                    { category: { $regex: query, $options: "i" } },
                    { status: query === "true" ? true : query === "false" ? false : undefined }
                ]
            } : {};

            const result = await Product.paginate(filter, options);
            return result;
        } catch (error) {
            console.error("Error en getProducts:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            throw new Error("ID inválido");
        }
    }

    async addProduct(data) {
        try {
            const { title, description, code, price, stock, category } = data;

            if (!title || !code || !price || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            if (typeof code !== "string" || code.trim().length < 3) {
                throw new Error("El código debe tener al menos 3 caracteres.");
            }

            const exists = await Product.findOne({ code });
            if (exists) throw new Error(`El código \"${code}\" ya existe.`);

            const product = new Product({
                title,
                description: description || "Sin descripción",
                code,
                price,
                stock,
                category
            });

            await product.save();
            return product;

        } catch (error) {
            console.error("Error en addProduct:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deleted = await Product.findByIdAndDelete(id);
            return deleted;
        } catch (error) {
            throw new Error("ID inválido o error al eliminar el producto");
        }
    }

    async updateProduct(id, updates) {
        try {
            const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
            return updated;
        } catch (error) {
            throw new Error("ID inválido o error al actualizar el producto");
        }
    }
}

module.exports = ProductManager;
