const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require("./routes/index");
const ProductManager = require("./managers/ProductManager");


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager(io);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/modules", express.static("node_modules"));


app.use("/api", routes);

app.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).send("Error al cargar la página");
    }
});

app.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts");
    } catch (error) {
        console.error("Error al cargar realTimeProducts", error);
        res.status(500).send("Error al cargar la página en tiempo real.");
    }
});
app.post("/api/products", async (req, res) => {
    try {
        console.log("Datos enviados al back:", req.body);

        const newProduct = await productManager.addProduct(req.body);
        io.emit("actualizarProductos", newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error en addProduct:", error.message);
        res.status(400).json({ error: "Error al agregar producto. Verifica los campos." });
    }
});


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

module.exports = httpServer;
