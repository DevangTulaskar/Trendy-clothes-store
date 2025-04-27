// smooth scrolling
function scrollToSection() {
    var navHeight = 140; 
    
    var clothingButton = document.querySelector('.top-nav ul li:nth-child(2) a');
    var clothingSection = document.getElementById('clothing');

    var accessoriesButton = document.querySelector('.top-nav ul li:nth-child(3) a');
    var accessoriesSection = document.getElementById('accessories');

    var footerButton = document.querySelector('.top-nav ul li:nth-child(4) a');
    var footerSection = document.getElementById('footer');

    clothingButton.addEventListener('click', function (event) {
        event.preventDefault(); 
        var sectionTop = clothingSection.offsetTop - navHeight;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    });

    accessoriesButton.addEventListener('click', function (event) {
        event.preventDefault();
        var sectionTop = accessoriesSection.offsetTop - navHeight;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    });

    footerButton.addEventListener('click', function (event) {
        event.preventDefault();
        var sectionTop = footerSection.offsetTop - 110;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    });
}
scrollToSection()


// for show cart container
function initializeCart() {
    const cartButton = document.querySelector(".cart-button");
    const cartContainer = document.querySelector(".show-cart");
    const closeCart = document.querySelector('.close-cart');

    cartButton.addEventListener("click", function() {
        cartContainer.classList.toggle("show-cart-active");
    });
    closeCart.addEventListener("click", function() {
        cartContainer.classList.remove("show-cart-active");
    });
}
initializeCart()


// add to cart interaction
function handleAddToCart() {
    const cartButtons = document.querySelectorAll('.clothing-cart-btn, .accessories-cart-btn');
    const cartContainer = document.querySelector('.show-cart');
    const itemsAdded = document.getElementById('items-added');
    const cartTotal = document.querySelector('.cart-total');

    let itemCount = 0;
    let totalPrice = 0;
    const itemQuantities = {};

    cartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const itemSection = button.closest('.clothing-list, .accessories-list');

            const itemName = itemSection.querySelector('.clothing-detail h3, .accessories-detail h3').textContent;
            const itemPriceString = itemSection.querySelector('.clothing-detail span, .accessories-detail span').textContent;
            const itemPrice = parseFloat(itemPriceString.replace('Rs ', ''));

            // checking whether the item is already exists in cart and updates the quantity in item-num
            if (itemQuantities[itemName]) {
                itemQuantities[itemName]++;
            } else {
                itemQuantities[itemName] = 1;
            }

            itemCount++;
            itemsAdded.textContent = itemCount;

            totalPrice += itemPrice;
            cartTotal.textContent = totalPrice.toLocaleString();

            // Checking if the item doesn't exist, create a new cart item and append it to the cart container
            const existingCartItem = cartContainer.querySelector(`[data-item="${itemName}"]`);
            if (existingCartItem) {
                const itemQuantityElement = existingCartItem.querySelector('.item-num');
                itemQuantityElement.textContent = itemQuantities[itemName];
            } else {
                const itemBrand = itemSection.querySelector('.clothing-detail p, .accessories-detail p').textContent;
                const itemImageSrc = itemSection.querySelector('.clothing-list-item img, .accessories-list-item img').getAttribute('src');

                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.setAttribute('data-item', itemName);
                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${itemImageSrc}" alt="${itemName}">
                    </div>
                    <div class="item-details">
                        <div class="item-name">${itemName}</div>
                        <div class="item-brand">${itemBrand}</div>
                        <div class="item-price">${itemPriceString}</div>
                        <div class="item-quantity">
                            <div class="item-minus"> - </div>
                            <div class="item-num">${itemQuantities[itemName]}</div>
                            <div class="item-plus"> + </div>
                        </div>
                    </div>
                `;

                cartContainer.appendChild(cartItem);

                // Added event listeners for the plus and minus buttons on the cart item
                const itemMinus = cartItem.querySelector('.item-minus');
                const itemPlus = cartItem.querySelector('.item-plus');

                itemMinus.addEventListener('click', ()=>{
                    itemQuantities[itemName]--;

                    const itemQuantityElement = cartItem.querySelector('.item-num');
                    itemQuantityElement.textContent = itemQuantities[itemName];

                    if (itemQuantities[itemName] === 0) {
                        cartContainer.removeChild(cartItem);
                    }

                    itemCount--;
                    itemsAdded.textContent = itemCount;
                    
                    totalPrice -= itemPrice; 
                    cartTotal.textContent = totalPrice.toLocaleString();
                });

                itemPlus.addEventListener('click', ()=>{
                    itemQuantities[itemName]++;
                    
                    const itemQuantityElement = cartItem.querySelector('.item-num');
                    itemQuantityElement.textContent = itemQuantities[itemName];

                    itemCount++;
                    itemsAdded.textContent = itemCount;

                    totalPrice += itemPrice; 
                    cartTotal.textContent = totalPrice.toLocaleString();
                });
            }
        });
    });
}
handleAddToCart();


// product details
function productDetailsPage() {
    const clothingItems = document.querySelectorAll(".clothing-list");
    const accessoriesItems = document.querySelectorAll(".accessories-list");

    function redirectToProductDetailsPage(itemType, itemName, itemBrand, itemPrice, itemImageSrc) {
        const url = `product-details.html?itemName=${encodeURIComponent(itemName)}&itemBrand=${encodeURIComponent(itemBrand)}&itemPrice=${encodeURIComponent(itemPrice)}&itemType=${encodeURIComponent(itemType)}&itemImageSrc=${encodeURIComponent(itemImageSrc)}`;
        window.location.href = url;
    }

    function handleItemClick(event) {
        const clickedItem = event.target.closest('.clothing-list, .accessories-list');
        if (!clickedItem) return;

        const itemType = clickedItem.classList.contains("clothing-list") ? "clothing" : "accessories";

        // Redirect to product details page if clicked on buttons
        if (event.target.closest('.clothing-btn') || event.target.closest('.accessories-btn')) {
            return;
        }

        const itemName = clickedItem.querySelector(`.${itemType}-detail h3`).textContent;
        const itemBrand = clickedItem.querySelector(`.${itemType}-detail p`).textContent;
        const itemPrice = clickedItem.querySelector(`.${itemType}-detail span`).textContent;
        const itemImageSrc = clickedItem.querySelector(`.${itemType}-list-item img`).getAttribute('src');

        redirectToProductDetailsPage(itemType, itemName, itemBrand, itemPrice, itemImageSrc);
    }
    
    clothingItems.forEach(function (item) {
        item.addEventListener("click", handleItemClick);
    });

    accessoriesItems.forEach(function (item) {
        item.addEventListener("click", handleItemClick);
    });

    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('itemName');
    const itemBrand = urlParams.get('itemBrand');
    const itemPrice = urlParams.get('itemPrice');
    const itemType = urlParams.get('itemType');
    const itemImageSrc = urlParams.get('itemImageSrc');

    // Display the item details in the .product div element
    if (itemName && itemBrand && itemPrice && itemType && itemImageSrc) {
        const productDetails = document.querySelector(".product");
        const productHTML = `
            <div class="product-list">
                <div class="item-image">
                    <img src="${itemImageSrc}" alt="${itemName}">
                </div>

                <div class="item-details">
                    <h3>${itemName}</h3>
                    <p> ${itemType}</p>
                    <p> ${itemBrand}</p>
                    <p> ${itemPrice}</p>
                    
                    <div class="${itemType}-cart-btn">
                        <i class="ri-shopping-bag-line"></i>
                        <span>Add to Cart</span>
                    </div>

                </div>
                
                
            </div>
        `;
        productDetails.innerHTML = productHTML;
    }
}
productDetailsPage();


// similar products
function similarProducts(){
    const urlParams = new URLSearchParams(window.location.search);
    const itemType = urlParams.get('itemType');

    let containerClass = '';
    let otherContainerClass = '';
    if (itemType === 'clothing') {
        containerClass = '.clothing-products-page';
        otherContainerClass = '.accessories-products-page';
    } else if (itemType === 'accessories') {
        containerClass = '.accessories-products-page';
        otherContainerClass = '.clothing-products-page';
    }

    const productsContainer = document.querySelector(containerClass);
    const otherContainer = document.querySelector(otherContainerClass);
    otherContainer.style.display = 'none';

    // random list items
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to show only 3 random items from the targeted list
    function showRandomItems(containerClass) {
        const items = document.querySelectorAll(`${containerClass} .clothing-list, ${containerClass} .accessories-list`);
        const shuffledItems = shuffle(Array.from(items)).slice(0, 3);
        productsContainer.innerHTML = ''; // Clear existing content
        shuffledItems.forEach(item => {
            productsContainer.appendChild(item.cloneNode(true));
        });
        productsContainer.style.display = 'flex';
    }

    showRandomItems(containerClass);
};
similarProducts()
