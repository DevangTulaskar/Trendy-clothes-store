// Smooth scrolling for top navigation
function scrollToSection() {
    const navHeight = 140;

    const clothingButton = document.querySelector('.top-nav ul li:nth-child(2) a');
    const accessoriesButton = document.querySelector('.top-nav ul li:nth-child(3) a');
    const footerButton = document.querySelector('.top-nav ul li:nth-child(4) a');

    const clothingSection = document.getElementById('clothing');
    const accessoriesSection = document.getElementById('accessories');
    const footerSection = document.getElementById('footer');

    function scrollHandler(section) {
        const sectionTop = section.offsetTop - navHeight;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }

    if (clothingButton && clothingSection) {
        clothingButton.addEventListener('click', function (event) {
            event.preventDefault();
            scrollHandler(clothingSection);
        });
    }

    if (accessoriesButton && accessoriesSection) {
        accessoriesButton.addEventListener('click', function (event) {
            event.preventDefault();
            scrollHandler(accessoriesSection);
        });
    }

    if (footerButton && footerSection) {
        footerButton.addEventListener('click', function (event) {
            event.preventDefault();
            scrollHandler(footerSection);
        });
    }
}
scrollToSection();

// Show/hide cart container
function initializeCart() {
    const cartButton = document.querySelector(".cart-button");
    const cartContainer = document.querySelector(".show-cart");
    const closeCart = document.querySelector(".close-cart");

    if (cartButton && cartContainer && closeCart) {
        cartButton.addEventListener("click", () => {
            cartContainer.classList.toggle("show-cart-active");
        });
        closeCart.addEventListener("click", () => {
            cartContainer.classList.remove("show-cart-active");
        });
    }
}
initializeCart();

// Add to cart logic
function handleAddToCart() {
    const cartButtons = document.querySelectorAll('.clothing-cart-btn, .accessories-cart-btn');
    const cartContainer = document.querySelector('.show-cart');
    const itemsAdded = document.getElementById('items-added');
    const cartTotal = document.querySelector('.cart-total');

    let itemCount = 0;
    let totalPrice = 0;
    const itemQuantities = {};

    cartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemSection = button.closest('.clothing-list, .accessories-list');
            const itemName = itemSection.querySelector('.clothing-detail h3, .accessories-detail h3').textContent;
            const itemPriceString = itemSection.querySelector('.clothing-detail span, .accessories-detail span').textContent;
            const itemPrice = parseFloat(itemPriceString.replace('Rs ', ''));

            if (itemQuantities[itemName]) {
                itemQuantities[itemName]++;
            } else {
                itemQuantities[itemName] = 1;
            }

            itemCount++;
            itemsAdded.textContent = itemCount;
            totalPrice += itemPrice;
            cartTotal.textContent = totalPrice.toLocaleString();

            const existingCartItem = cartContainer.querySelector(`[data-item="${itemName}"]`);
            if (existingCartItem) {
                existingCartItem.querySelector('.item-num').textContent = itemQuantities[itemName];
            } else {
                const itemBrand = itemSection.querySelector('.clothing-detail p, .accessories-detail p').textContent;
                const itemImageSrc = itemSection.querySelector('img').getAttribute('src');

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
                            <div class="item-minus">-</div>
                            <div class="item-num">${itemQuantities[itemName]}</div>
                            <div class="item-plus">+</div>
                        </div>
                    </div>
                `;
                cartContainer.appendChild(cartItem);

                const itemMinus = cartItem.querySelector('.item-minus');
                const itemPlus = cartItem.querySelector('.item-plus');

                itemMinus.addEventListener('click', () => {
                    if (itemQuantities[itemName] > 1) {
                        itemQuantities[itemName]--;
                        itemCount--;
                        totalPrice -= itemPrice;
                    } else {
                        delete itemQuantities[itemName];
                        cartContainer.removeChild(cartItem);
                        itemCount--;
                        totalPrice -= itemPrice;
                    }
                    itemsAdded.textContent = itemCount;
                    cartTotal.textContent = totalPrice.toLocaleString();
                    const itemQuantityElement = cartItem.querySelector('.item-num');
                    if (itemQuantityElement) {
                        itemQuantityElement.textContent = itemQuantities[itemName] || 0;
                    }
                });

                itemPlus.addEventListener('click', () => {
                    itemQuantities[itemName]++;
                    itemCount++;
                    totalPrice += itemPrice;
                    itemsAdded.textContent = itemCount;
                    cartTotal.textContent = totalPrice.toLocaleString();
                    const itemQuantityElement = cartItem.querySelector('.item-num');
                    itemQuantityElement.textContent = itemQuantities[itemName];
                });
            }
        });
    });
}
handleAddToCart();

// Product details page logic
function productDetailsPage() {
    const clothingItems = document.querySelectorAll(".clothing-list");
    const accessoriesItems = document.querySelectorAll(".accessories-list");

    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('itemName');
    const itemBrand = urlParams.get('itemBrand');
    const itemPrice = urlParams.get('itemPrice');
    const itemType = urlParams.get('itemType');
    const itemImageSrc = urlParams.get('itemImageSrc');

    function redirectToProductDetailsPage(itemType, itemName, itemBrand, itemPrice, itemImageSrc) {
        const url = `product-details.html?itemName=${encodeURIComponent(itemName)}&itemBrand=${encodeURIComponent(itemBrand)}&itemPrice=${encodeURIComponent(itemPrice)}&itemType=${encodeURIComponent(itemType)}&itemImageSrc=${encodeURIComponent(itemImageSrc)}`;
        window.location.href = url;
    }

    function handleItemClick(event) {
        const clickedItem = event.target.closest('.clothing-list, .accessories-list');
        if (!clickedItem) return;

        const itemType = clickedItem.classList.contains("clothing-list") ? "clothing" : "accessories";
        if (event.target.closest('.clothing-btn') || event.target.closest('.accessories-btn')) {
            return;
        }

        const itemName = clickedItem.querySelector(`.${itemType}-detail h3`).textContent;
        const itemBrand = clickedItem.querySelector(`.${itemType}-detail p`).textContent;
        const itemPrice = clickedItem.querySelector(`.${itemType}-detail span`).textContent;
        const itemImageSrc = clickedItem.querySelector(`.${itemType}-list-item img`).getAttribute('src');

        redirectToProductDetailsPage(itemType, itemName, itemBrand, itemPrice, itemImageSrc);
    }

    clothingItems.forEach(item => item.addEventListener("click", handleItemClick));
    accessoriesItems.forEach(item => item.addEventListener("click", handleItemClick));

    if (itemName && itemBrand && itemPrice && itemType && itemImageSrc) {
        const productDetails = document.querySelector(".product");
        if (productDetails) {
            const productHTML = `
                <div class="product-list">
                    <div class="item-image">
                        <img src="${itemImageSrc}" alt="${itemName}">
                    </div>
                    <div class="item-details">
                        <h3>${itemName}</h3>
                        <p>${itemType}</p>
                        <p>${itemBrand}</p>
                        <p>${itemPrice}</p>
                        <div class="${itemType}-cart-btn product-page-cart-btn">
                            <i class="ri-shopping-bag-line"></i>
                            <span>Add to Cart</span>
                        </div>
                    </div>
                </div>
            `;
            productDetails.innerHTML = productHTML;

            const productCartBtn = document.querySelector('.product-page-cart-btn');
            if (productCartBtn) {
                productCartBtn.addEventListener('click', function () {
                    alert('Added to cart! (You can extend full cart logic here)');
                });
            }
        }
    }
}
productDetailsPage();

// Similar products logic
function similarProducts() {
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

    if (otherContainer) {
        otherContainer.style.display = 'none';
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function showRandomItems(containerClass) {
        const items = document.querySelectorAll(`${containerClass} .clothing-list, ${containerClass} .accessories-list`);
        const shuffledItems = shuffle(Array.from(items)).slice(0, 3);
        const clones = shuffledItems.map(item => item.cloneNode(true));
        productsContainer.innerHTML = '';
        clones.forEach(clone => productsContainer.appendChild(clone));
        productsContainer.style.display = 'flex';
    }

    if (productsContainer) {
        showRandomItems(containerClass);
    }
}
similarProducts();
