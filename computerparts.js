document.addEventListener('DOMContentLoaded', function() {
  // Cart functionality
  let cart = [];
  
  // Load cart from localStorage if available
  if (localStorage.getItem('cart')) {
    try {
      cart = JSON.parse(localStorage.getItem('cart'));
      updateCartTable();
      updateCartItemCount(); // Add this line
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      localStorage.removeItem('cart');
    }
  }
  
  // Quantity buttons functionality
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const input = this.parentElement.querySelector('.quantity-input');
      const currentValue = parseInt(input.value);
      
      if (this.classList.contains('plus') && currentValue < parseInt(input.max)) {
        input.value = currentValue + 1;
      } else if (this.classList.contains('minus') && currentValue > parseInt(input.min)) {
        input.value = currentValue - 1;
      }
    });
  });
  
  // Add to cart functionality
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.part-card');
      const quantityInput = card.querySelector('.quantity-input');
      const quantity = parseInt(quantityInput.value);
      
      if (quantity > 0) {
        const productId = card.dataset.id;
        const productName = card.querySelector('h3').textContent;
        const productPrice = parseInt(card.dataset.price);
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
          // Update quantity if product already in cart
          cart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
          });
        }
        
        // Reset quantity input
        quantityInput.value = 0;
        
        // Update cart display
        updateCartTable();
        updateCartItemCount(); // Add this line
        
        // Save cart to localStorage
        saveCart();
        
        // Show success message
        alert(`Added ${quantity} x ${productName} to cart!`);
      }
    });
  });
  
  // Function to update cart table
  function updateCartTable() {
    const cartTableBody = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Clear current table
    cartTableBody.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add items to table
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>Rs. ${item.price.toLocaleString()}</td>
        <td>${item.quantity}</td>
        <td>Rs. ${itemTotal.toLocaleString()}</td>
        <td><button class="remove-item" data-index="${index}">Remove</button></td>
      `;
      
      cartTableBody.appendChild(row);
    });
    
    // Update total
    cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        cart.splice(index, 1);
        updateCartTable();
        updateCartItemCount(); // Add this line
        saveCart();
      });
    });
    
    // Toggle checkout button based on cart status
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cart.length > 0) {
      checkoutBtn.removeAttribute('disabled');
    } else {
      checkoutBtn.setAttribute('disabled', 'disabled');
    }
  }
  
  // Function to update cart item count in the floating button
  function updateCartItemCount() {
    const cartItemCount = document.getElementById('cart-item-count');
    if (cartItemCount) {
      // Calculate total number of items in cart
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartItemCount.textContent = totalItems;
      
      // Show/hide floating button based on cart content
      const floatingCartBtn = document.querySelector('.floating-cart-btn');
      if (totalItems > 0) {
        floatingCartBtn.style.display = 'block';
      } else {
        floatingCartBtn.style.display = 'none';
      }
    }
  }
  
  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Clear cart functionality
  document.getElementById('clear-cart').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your cart?')) {
      cart = [];
      updateCartTable();
      updateCartItemCount(); // Add this line
      saveCart();
    }
  });
  
  // Save as favorite functionality
  document.getElementById('save-favorite').addEventListener('click', function() {
    if (cart.length > 0) {
      localStorage.setItem('favorite-cart', JSON.stringify(cart));
      alert('Your cart has been saved as a favorite!');
    } else {
      alert('Your cart is empty. Add items before saving as favorite.');
    }
  });
  
  // Apply favorite functionality
  document.getElementById('apply-favorite').addEventListener('click', function() {
    const favoriteCart = localStorage.getItem('favorite-cart');
    
    if (favoriteCart) {
      if (confirm('This will replace your current cart. Continue?')) {
        cart = JSON.parse(favoriteCart);
        updateCartTable();
        updateCartItemCount(); // Add this line
        saveCart();
        
        // Reset all quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
          input.value = 0;
        });
        
        // Update quantity inputs based on favorite cart
        cart.forEach(item => {
          const card = document.querySelector(`.part-card[data-id="${item.id}"]`);
          if (card) {
            card.querySelector('.quantity-input').value = item.quantity;
          }
        });
        
        alert('Favorite cart has been applied!');
      }
    } else {
      alert('No favorite cart found. Save a cart as favorite first.');
    }
  });
  
  // Checkout functionality
  document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
      // Save cart to localStorage for checkout page
      localStorage.setItem('checkout-cart', JSON.stringify(cart));
      // Navigate to checkout page
      window.location.href = 'checkout.html';
    } else {
      alert('Your cart is empty. Add items before checking out.');
    }
  });
  
  // Floating cart button functionality
  const viewCartBtn = document.getElementById('view-cart-btn');
  if (viewCartBtn) {
    viewCartBtn.addEventListener('click', function() {
      // Scroll to cart section
      const cartSection = document.querySelector('.cart-section');
      if (cartSection) {
        cartSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Initialize cart item count
  updateCartItemCount();
});
