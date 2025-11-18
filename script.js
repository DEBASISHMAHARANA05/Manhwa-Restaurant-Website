const buttons = document.querySelectorAll('.tab-btn, .sub-tab-btn');
const contents = document.querySelectorAll('.tab-content');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    if (tab) {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    contents.forEach(content => content.classList.remove('active'));
    const target = document.getElementById(tab);
    if (target) {
        target.classList.add('active');
    }
    }
  }); 
});

function openTabAndScroll(tabId, scrollSelector) {
 
  document.querySelectorAll('.tab-content').forEach(section => section.classList.remove('active'));
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');

  const target = document.querySelector(scrollSelector);
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth' });
    }, 100); 
  }
}

function addToCart(item, price, quantity = 1) {
  const existing = cart.find(i => i.item === item);
  if (existing) {
    existing.quantity += quantity;
    existing.subtotal = existing.quantity * existing.price;
  } else {
    cart.push({ item, price, quantity, subtotal: price * quantity });
  }
  alert("Item is added.")
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  alert("Item is removed.")
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  document.getElementById('cart-count').textContent = cart.reduce((sum, i) => sum + i.quantity, 0);

  cart.forEach(({ item, price, quantity, subtotal }, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
    <strong>${item}</strong><br>
    Quantity: ${quantity} × ₹${price} = ₹${subtotal}
    <button onclick="removeFromCart(${index})" style="margin-left:10px; background:#c0392b; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Remove</button>
    `;
    cartItems.appendChild(li);
    total += subtotal;
  });

  cartTotal.textContent = `Total: ₹${total}`;
}

document.querySelectorAll('.sub-tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const price = parseInt(button.dataset.price);
    if (item && price) {
      addToCart(item, price);
    }
  });
});

document.querySelectorAll('.order-btn').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const price = parseInt(button.dataset.price);
    const qtyInput = button.parentElement.querySelector('.qty-input');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    if (item && price) {
      addToCart(item, price, quantity);
    }
  });
});

document.getElementById('checkout-form').addEventListener('submit', function(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before placing an order.");
    return;
  }

  const name = document.getElementById('customer-name').value;
  const address = document.getElementById('customer-address').value;
  const payment = document.getElementById('payment-method').value;

  let receiptHTML = `<p><strong>Name:</strong> ${name}</p>
                     <p><strong>Address:</strong> ${address}</p>
                     <p><strong>Payment:</strong> ${payment}</p>
                     <hr><p><strong>Items:</strong></p><ul>`;

  cart.forEach(({ item, quantity, price }) => {
    receiptHTML += `<li>${item} × ${quantity} = ₹${quantity * price}</li>`;
  });

  receiptHTML += `</ul><p><strong>Total:</strong> ₹${cart.reduce((sum, i) => sum + i.subtotal, 0)}</p>`;

  document.getElementById('receipt-content').innerHTML = receiptHTML;
  document.getElementById('receipt-modal').style.display = 'flex';

  cart = [];
  updateCart();
  localStorage.removeItem('mahawaCart');
  this.reset();
});

document.getElementById('floating-cart').addEventListener('click', () => {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('order').classList.add('active');
});

