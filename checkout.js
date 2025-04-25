document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage
  const checkoutCart = localStorage.getItem('checkout-cart');
  
  if (!checkoutCart) {
    // Redirect to computer parts page if no cart is found
    alert('No items in cart. Redirecting to products page.');
    window.location.href = 'computerparts.html';
    return;
  }
  
  const cart = JSON.parse(checkoutCart);
  
  // Populate order summary
  populateOrderSummary(cart);
  
  // Back to cart button functionality
  document.getElementById('back-to-cart').addEventListener('click', function() {
    window.location.href = 'computerparts.html';
  });
  
  // Form submission
  document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (validateForm()) {
      // Process payment (in a real app, this would connect to a payment gateway)
      processPayment();
    }
  });
  
  // Continue shopping button in success modal
  document.getElementById('continue-shopping').addEventListener('click', function() {
    // Clear cart and redirect to computer parts page
    localStorage.removeItem('checkout-cart');
    localStorage.removeItem('cart');
    window.location.href = 'computerparts.html';
  });
  
  // Close modal button
  document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('success-modal').style.display = 'none';
  });
});

// Function to populate order summary
function populateOrderSummary(cart) {
  const orderTableBody = document.getElementById('order-items');
  const orderTotal = document.getElementById('order-total');
  
  // Clear current table
  orderTableBody.innerHTML = '';
  
  // Calculate total
  let total = 0;
  
  // Add items to table
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>Rs. ${item.price.toLocaleString()}</td>
      <td>${item.quantity}</td>
      <td>Rs. ${itemTotal.toLocaleString()}</td>
    `;
    
    orderTableBody.appendChild(row);
  });
  
  // Update total
  orderTotal.textContent = `Rs. ${total.toLocaleString()}`;
}

// Function to validate form
function validateForm() {
  // Get all required inputs
  const requiredInputs = document.querySelectorAll('[required]');
  let isValid = true;
  
  // Check each required field
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  
  // Validate email format
  const emailInput = document.getElementById('email');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value && !emailPattern.test(emailInput.value)) {
    isValid = false;
    emailInput.classList.add('error');
    alert('Please enter a valid email address.');
    return false;
  }
  
  // Validate phone number (simple validation)
  const phoneInput = document.getElementById('phone');
  const phonePattern = /^\d{10,15}$/;
  if (phoneInput.value && !phonePattern.test(phoneInput.value.replace(/[\s-]/g, ''))) {
    isValid = false;
    phoneInput.classList.add('error');
    alert('Please enter a valid phone number.');
    return false;
  }
  
  // Validate card number (simple validation)
  const cardInput = document.getElementById('card-number');
  const cardPattern = /^\d{16}$/;
  if (cardInput.value && !cardPattern.test(cardInput.value.replace(/[\s-]/g, ''))) {
    isValid = false;
    cardInput.classList.add('error');
    alert('Please enter a valid 16-digit card number.');
    return false;
  }
  
  // Validate expiry date (MM/YY format)
  const expiryInput = document.getElementById('expiry');
  const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (expiryInput.value && !expiryPattern.test(expiryInput.value)) {
    isValid = false;
    expiryInput.classList.add('error');
    alert('Please enter a valid expiry date in MM/YY format.');
    return false;
  }
  
  // Validate CVV (3 or 4 digits)
  const cvvInput = document.getElementById('cvv');
  const cvvPattern = /^\d{3,4}$/;
  if (cvvInput.value && !cvvPattern.test(cvvInput.value)) {
    isValid = false;
    cvvInput.classList.add('error');
    alert('Please enter a valid CVV (3 or 4 digits).');
    return false;
  }
  
  if (!isValid) {
    alert('Please fill in all required fields correctly.');
  }
  
  return isValid;
}

// Function to process payment
function processPayment() {
  // In a real application, this would connect to a payment gateway
  // For this demo, we'll simulate a successful payment
  
  // Generate random order number
  const orderNumber = 'EG-' + Math.floor(100000 + Math.random() * 900000);
  
  // Calculate delivery date (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  
  // Format delivery date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', options);
  
  // Get customer email
  const customerEmail = document.getElementById('email').value;
  
  // Update success modal with order details
  document.getElementById('order-number').textContent = orderNumber;
  document.getElementById('delivery-date').textContent = formattedDeliveryDate;
  document.getElementById('customer-email').textContent = customerEmail;
  
  // Show success modal
  document.getElementById('success-modal').style.display = 'block';
}
