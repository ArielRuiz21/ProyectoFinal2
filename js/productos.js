let products = [];
let cart = loadCartFromLocalStorage();
const errorCarritoDiv = document.getElementById('error_carrito');
errorCarritoDiv.style.color = 'red';

function displayErrorMessage(productId) {
    errorCarritoDiv.innerHTML = `<p>Producto con ID: ${productId} no encontrado</p>`;
}

function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        displayErrorMessage(productId);
        return;
    }

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.totalPrice = cartItem.quantity * product.price;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            totalPrice: quantity * product.price
        });
    }

    saveCartToLocalStorage();
    renderCart();
    showAlert('success', 'Este producto ha sido agregado al Carrito!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    renderCart();
    showAlert('error', 'Producto Borrado del Carrito');
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productDiv = createProductElement(product);
        productList.appendChild(productDiv);
    });
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';

    cart.forEach(item => {
        const cartItemDiv = createCartItemElement(item);
        cartDiv.appendChild(cartItemDiv);
    });

    
    const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const cartTotalDiv = document.getElementById('cart-total');
    cartTotalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
}

function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
        <p>${product.name} - $${product.price}</p>
        <img src="${product.image}" alt="${product.name}" style="width:100px;height:auto;">
        <button onclick="addToCart(${product.id}, 1)" class="button_grey">Agregar al Carrito</button>  
    `;
    productDiv.querySelector('button').addEventListener('click', () => {
        showAlert('success', 'Este producto ha sido agregado al Carrito!');
    });
    return productDiv;
}

function createCartItemElement(item) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.innerHTML = `
        <p>ID: ${item.id}, Nombre: ${item.name}, Cantidad: ${item.quantity}, Precio Total: $${item.totalPrice}</p>
        <button onclick="removeFromCart(${item.id})" class="button_red">Eliminar</button>
    `;
    cartItemDiv.querySelector('button').addEventListener('click', () => {
        showAlert('error', 'Producto Borrado del Carrito');
    });
    return cartItemDiv;
}

function showAlert(icon, title) {
    Swal.fire({
        position: "center",
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 2000
    });
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
            renderCart();
        })
        .catch(error => console.error('Error cargando los productos:', error));
});

// Función para manejar el evento de compra
document.getElementById('buy-button').addEventListener('click', () => {
    if (cart.length === 0) {
        showAlert('error', 'El carrito está vacío');
    } else {
        const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
        showAlert('success', `Compra realizada. Total: $${total.toFixed(2)}`);
        cart = [];
        saveCartToLocalStorage();
        renderCart();
    }
});
