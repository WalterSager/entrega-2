module.exports = (io, productManager) => {
    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado (socket):", socket.id);
  
      socket.on("nuevoProducto", async (productoData) => {
        try {
          console.log("Producto agregador correctamente desde socket!")
          io.emit("actualizarProductos");
        } catch (error) {
          console.error("Error al agregar producto desde socket:", error.message);
          socket.emit("error", error.message);
        }
      });
  
      socket.on("eliminarProducto", async (productId) => {
        try {
          const deleted = await productManager.deleteProduct(productId);
          if (deleted) {
            io.emit("productoEliminado", productId);
          } else {
            socket.emit("error", "Producto no encontrado para eliminar");
          }
        } catch (error) {
          console.error("Error al eliminar producto desde socket:", error.message);
          socket.emit("error", error.message);
        }
      });
    });
  };
  
