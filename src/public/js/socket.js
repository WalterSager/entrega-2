const socket = io();

document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();

    document.getElementById("formProducto").addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const code = document.getElementById("code").value.trim();
        const price = parseFloat(document.getElementById("price").value);
        const stock = parseInt(document.getElementById("stock").value);
        const category = document.getElementById("category").value.trim();

        if (!title || !description || !code || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0 || !category || category.length < 4) {
            alert("Todos los campos son obligatorios y deben ser válidos.");
            return;
        }

        const newProduct = { title, description, code, price, stock, category };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`Error: ${data.error}`);
                return;
            }

            socket.emit("nuevoProducto", data);
            cargarProductos();
            document.getElementById("formProducto").reset();
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            alert("Hubo un error al agregar el producto.");
        }
    });
});

const filtroForm = document.getElementById("filtros");
if (filtroForm) {
    filtroForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await cargarProductos();
    });
}

socket.on("actualizarProductos", async () => {
    await cargarProductos();
});

socket.on("productoEliminado", async () => {
    await cargarProductos();
});

async function cargarProductos() {
    const lista = document.getElementById("listaProductos");

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const limit = urlParams.get("limit") || 10;
        const page = urlParams.get("page") || 1;
        const sort = urlParams.get("sort") || "";
        const query = urlParams.get("query") || "";

        const res = await fetch(`/api/products?limit=${limit}&page=${page}&sort=${sort}&query=${query}`);
        const data = await res.json();
        const productos = data.docs;

        lista.innerHTML = "";

        if (!productos || productos.length === 0) {
            lista.innerHTML = "<li>No hay productos disponibles.</li>";
        } else {
            productos.forEach(producto => agregarProductoDOM(producto));
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function agregarProductoDOM(producto) {
    const lista = document.getElementById("listaProductos");
    const item = document.createElement("li");
    item.setAttribute("id", `producto-${producto._id}`);
    item.innerHTML = `
        <strong>${producto.title}</strong> - $${producto.price} 
        <button onclick="eliminarProducto('${producto._id}')">Borrar</button>`;
    lista.appendChild(item);
}

function eliminarProducto(id) {
    fetch(`/api/products/${id}`, { method: "DELETE" })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                alert(`Error: ${data.error || "No se pudo eliminar el producto"}`);
                return;
            }
            socket.emit("eliminarProducto", id);
            cargarProductos();
        })
        .catch(error => console.error("Error al eliminar producto:", error));
}
