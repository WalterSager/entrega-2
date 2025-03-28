const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");

const routes = require("./src/routes/index");
const viewsRouter = require("./src/routes/views.routes");
const connectDB = require("./src/config/db");

const ProductManager = require("./src/managers/ProductManager");
const socketConfig = require("./src/socket/socket");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB();

const productManager = new ProductManager(io);

socketConfig(io, productManager);

const hbs = exphbs.create({
    helpers: {
      eq: (a, b) => a === b,
    },

    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      }
  });
  
  app.engine("handlebars", hbs.engine);
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "/src/views"));
  
  app.engine("handlebars", hbs.engine);
  
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/src/public")));
app.use("/modules", express.static("node_modules"));

// Rutas
app.use("/api", routes);
app.use("/", viewsRouter);

// home productos
app.get("/", (req, res) => {
    res.redirect("/products");
});

// realtime
app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

// agregar producto desde formulario (WebSocket)
app.post("/api/product", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        io.emit("actualizarProductos", newProduct); // Socket en acción 🔥
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error en addProduct:", error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = httpServer;
