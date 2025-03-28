async function eliminarCarrito(cartId) {
    if (!confirm("Eliminar este carrito?")) return;

    try {
      const res = await fetch(`/api/carts/delete/${cartId}`, { method: "DELETE" })

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Carrito eliminado correctamente");
        location.reload();
      }
    } catch (error) {
      console.error("Error al eliminar carrito:", error);
    }
  }