const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor(io) {
    this.io = io;
    this.path = path.join(__dirname, "../data/products.json");
  }

  async getProducts() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo products.json:", error);
        return [];
    }
}


  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);

    return product || null;
  }

  async addProduct({ title, description, code, price, status = true, stock, category, thumbnails }) {
    try {
      const products = await this.getProducts();

    if (!title || !code || !price || !stock || !category) {
        throw new Error("Todos los campos son obligatorios")
    }

    if (typeof code !== "string" || code.trim().length < 3) {
      throw new Error("El código debe tener al menos 3 caracteres.");
    }

    if (products.some(p => p.code === code)) {
        throw new Error (`El codigo " ${code} " ya existe.`);
    }

    if (typeof title !== "string" || title.trim().length < 4) {
      throw new Error("El título debe tener al menos 4 caracteres.");
    }

    if (typeof category !== "string" || category.trim().length < 4) {
      throw new Error("La categoría debe tener al menos 4 caracteres.");
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id +1 : 1,
        title,
        description: description || "El usuario no agrego descripcion",
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    if (this.io) {
      this.io.emit("ActualizarProductos", newProduct);
    } else {
      console.warn("this.io undefined")
    }

    return newProduct;

    } catch (error) {
        console.error("Error en addProduct:", error.message);
        throw error;
    }

  }

  async updateProduct(id, datos) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`No se encontro el producto con ID ${id}`);

    products[index] = { ...products[index], ...datos, id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        console.error(`No se encontró el producto con ID ${id}`);
        return null;
    }

    products.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    
    console.log(`Producto con ID ${id} eliminado correctamente`);
    return { message: `Producto con ID ${id} eliminado` };
}
  
}

module.exports = ProductManager;
