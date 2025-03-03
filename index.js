const httpServer = require("./app");

const PORT = 8080;

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});