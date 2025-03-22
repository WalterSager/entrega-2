const ProductManager = require("../managers/ProductManager");

module.exports = (io, ProductManager) => {
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado");
    
        socket.on("nuevoProducto", (producto) => {
            console.log("Nuevo producto recibido:", producto);
            io.emit("actualizarProductos", producto);
        });
    
        socket.on("eliminarProducto", (productId) => {
            console.log(`Producto eliminado con ID: ${productId}`);
            io.emit("productoEliminado", productId);
        });
    });    
};