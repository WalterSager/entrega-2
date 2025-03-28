function esObjectIdValido(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

async function verificarCarritoExistente(id) {
  try {
    const res = await fetch(`/api/carts/${id}`);
    return res.ok;
  } catch {
    return false;
  }
}

async function asegurarCarrito() {
  let cartId = localStorage.getItem("cartId");

  if (!cartId || !esObjectIdValido(cartId) || !(await verificarCarritoExistente(cartId))) {
    console.warn("Carrito inválido o inexistente. Creando uno nuevo...");
    localStorage.removeItem("cartId");

    const res = await fetch("/api/carts", { method: "POST" });
    const data = await res.json();

    if (res.ok && data._id) {
      cartId = data._id;
      localStorage.setItem("cartId", cartId);
    } else {
      throw new Error("No se pudo crear un carrito.");
    }
  }

  return cartId;
}

async function agregarAlCarrito(productId) {
  try {
    const cartId = await asegurarCarrito();

    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Error: ${data.error}`);
    } else {
      alert("Producto agregado al carrito!");
    }
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
    alert("Error al intentar agregar al carrito.");
  }
}

(async () => {
  try {
    await asegurarCarrito();
  } catch (error) {
    console.error("Error asegurando carrito al cargar la página:", error);
  }
})();
