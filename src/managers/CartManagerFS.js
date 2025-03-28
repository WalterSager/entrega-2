const Product = require("../models/Product");

class ProductManager {
  constructor(io) {
    this.io = io;
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true,
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
      };

      let filter = {};
      if (query) {
        if (query === "true" || query === "false") {
          filter.status = query === "true";
        } else {
          filter.category = { $regex: query, $options: "i" };
        }
      }

      const result = await Product.paginate(filter, options);
      return result;
    } catch (error) {
      console.error("Error en getProducts:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      return product;
    } catch (error) {
      throw new Error("ID inválido");
    }
  }

  async addProduct(data) {
    const { title, description, code, price, stock, category, thumbnails = [] } = data;

    if (!title || !code || !price || !stock || !category) {
      throw new Error("Todos los campos obligatorios deben ser completados");
    }

    if (typeof code !== "string" || code.trim().length < 3) {
      throw new Error("El código debe tener al menos 3 caracteres");
    }

    const codeExists = await Product.findOne({ code });
    if (codeExists) {
      throw new Error(`El código "${code}" ya existe`);
    }

    if (typeof title !== "string" || title.trim().length < 4) {
      throw new Error("El título debe tener al menos 4 caracteres");
    }

    if (typeof category !== "string" || category.trim().length < 4) {
      throw new Error("La categoría debe tener al menos 4 caracteres");
    }

    const newProduct = new Product({
      title,
      description: description || "Sin descripción",
      code,
      price,
      stock,
      category,
      thumbnails
    });

    const savedProduct = await newProduct.save();

    if (this.io) {
      this.io.emit("actualizarProductos");
    }

    return savedProduct.toObject();
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      if (result && this.io) {
        this.io.emit("productoEliminado");
      }
      return result;
    } catch (error) {
      throw new Error("Error al eliminar el producto. Verifica el ID.");
    }
  }

  async updateProduct(id, data) {
    try {
      const updated = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) throw new Error("Producto no encontrado");
      return updated;
    } catch (error) {
      throw new Error(error.message || "Error al actualizar el producto");
    }
  }
}

module.exports = ProductManager;