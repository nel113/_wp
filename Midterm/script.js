// Original JavaScript for one-page store website
document.addEventListener('DOMContentLoaded', function() {
    // Product data
    const products = {
        featured: [
            {
                id: 1,
                name: "Rainbow Water Bottle",
                description: "Stay hydrated in style with this vibrant water bottle.",
                price: 24.99,
                image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                category: "featured"
            },
            {
                id: 2,
                name: "Colorful Notebook Set",
                description: "Set of 3 notebooks with colorful covers and premium paper.",
                price: 18.50,
                image: "https://images.unsplash.com/photo-1467320424268-f91a16cf7c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "featured"
            },
            {
                id: 3,
                name: "Abstract Wall Art",
                description: "Vibrant abstract painting to brighten any room.",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "featured"
            }
        ],
        homeDecor: [
            {
                id: 4,
                name: "Colorful Throw Pillow",
                description: "Soft and vibrant pillow for your couch or bed.",
                price: 29.99,
                image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                category: "homeDecor"
            },
            {
                id: 5,
                name: "Geometric Vase",
                description: "Modern vase with colorful geometric patterns.",
                price: 45.00,
                image: "https://images.unsplash.com/photo-1585238342024-78d80f7c2a0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                category: "homeDecor"
            },
            {
                id: 6,
                name: "Rainbow Rug",
                description: "Soft and durable rug with rainbow colors.",
                price: 120.00,
                image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "homeDecor"
            }
        ],
        stationery: [
            {
                id: 7,
                name: "Colorful Pen Set",
                description: "Set of 12 vibrant gel pens for all your creative needs.",
                price: 15.99,
                image: "https://images.unsplash.com/photo-1453486030486-0a5ffcd82cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "stationery"
            },
            {
                id: 8,
                name: "Watercolor Palette",
                description: "Premium watercolor set with 24 vibrant colors.",
                price: 32.50,
                image: "https://images.unsplash.com/photo-1579963333765-b4129b3250fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "stationery"
            },
            {
                id: 9,
                name: "Sticker Collection",
                description: "Over 100 colorful stickers for planners and journals.",
                price: 12.99,
                image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "stationery"
            }
        ],
        accessories: [
            {
                id: 10,
                name: "Rainbow Tote Bag",
                description: "Stylish and spacious tote bag with rainbow stripes.",
                price: 28.00,
                image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
                category: "accessories"
            },
            {
                id: 11,
                name: "Color Block Scarf",
                description: "Soft scarf with bold color blocks for any season.",
                price: 35.00,
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                category: "accessories"
            },
            {
                id: 12,
                name: "Vibrant Sunglasses",
                description: "Trendy sunglasses with colorful frames.",
                price: 42.99,
                image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                category: "accessories"
            }
        ]
    };

    // Shopping cart
    let cart = [];

    // DOM elements
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.querySelector('.cart-count');

    // Display products
    function displayProducts() {
        for (const category in products) {
            const container = document.getElementById(`${category}Products`);
            if (container) {
                products[category].forEach(product => {
                    const productElement = createProductElement(product);
                    container.appendChild(productElement);
                });
            }
        }
    }

    // Create product element
    function createProductElement(product) {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        return productElement;
    }

    // Add to cart
    function addToCart(productId) {
        let product;
        
        // Find the product in any category
        for (const category in products) {
            const foundProduct = products[category].find(p => p.id === productId);
            if (foundProduct) {
                product = foundProduct;
                break;
            }
        }

        if (!product) return;

        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCart();
    }

    // Update cart
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;

        // Update cart modal if open
        if (cartModal.style.display === 'flex') {
            renderCartItems();
        }
    }

    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalElement.textContent = '0.00';
            return;
        }

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);

        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateQuantity(id, -1);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateQuantity(id, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }

    // Update quantity
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            updateCart();
        }
    }

    // Remove from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Event listeners
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        renderCartItems();
    });

    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            addToCart(productId);
            
            // Add animation to cart icon
            cartIcon.classList.add('animate-bounce');
            setTimeout(() => {
                cartIcon.classList.remove('animate-bounce');
            }, 1000);
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize
    displayProducts();
});