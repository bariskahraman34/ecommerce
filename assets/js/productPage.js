const BASE_URL = "https://dummyjson.com";
const container = document.querySelector('.container');

let clickedProductStorage = JSON.parse(localStorage.getItem('clickedProduct'));

let clickedProductId = clickedProductStorage.product 

async function fetchDummyJson(endpoint){
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const items = await response.json();
    return items;
}

async function listProduct(){
    const product = await fetchDummyJson(`products/${clickedProductId}`);
    const title = document.querySelector('title');
    title.textContent = `${product.brand} - ${product.title}`;
    console.log(product);
    container.innerHTML = 
    `
    <div class="product-container">
        <div class="product-left-side-container">
            <div class="big-image-container">
                <img src="${product.images[0]}" alt="">
            </div>
            <div class="small-image-container">
            </div>
        </div>
        <div class="product-right-side-container">
            <span class="brand">${product.brand}</span>
            <span class="name">${product.title}</span>
            <p class="description">
                ${product.description}
            </p>
            <div class="price-container">
                <div class="current-price-container">
                    <span class="badge-new-price">$${product.price}</span>
                    <span class="discount-rate">${product.discountPercentage}%</span>
                </div>
                <span class="badge-old-price">$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>
            </div>
            <div class="add-card-container">
                <div class="quantitiy-container">
                    <a href="#" class="quantity-down">-</a>
                    <strong>0</strong>
                    <a href="#" class="quantity-up">+</a>
                </div>
                <button class="big-btn">
                    <img src="assets/icons/basket-white.svg" alt="">
                    Add To Cart</button>
            </div>
        </div>
    </div>
    `;
    const imagesContainer = document.querySelector('.small-image-container');
    for (const image of product.images) {
        imagesContainer.innerHTML += 
        `
        <img src="${image}" alt="">
        `
    }
}

listProduct();