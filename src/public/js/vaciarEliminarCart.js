async function vaciarCarrito(cartId) {
  const confirmar = confirm("Estás seguro que querés vaciar este carrito?");
  if (!confirmar) return;

  try {
    const res = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Error: ${data.error}`);
    } else {
      alert("Carrito vaciado correctamente");

      location.reload();
    }
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    alert("Hubo un error al vaciar el carrito.");
  }
}


  async function eliminarProductoDelCarrito(cartId, productId) {
    try {
      const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Producto eliminado del carrito");
        location.reload();
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  }