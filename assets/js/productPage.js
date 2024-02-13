const BASE_URL = "https://dummyjson.com";
const container = document.querySelector('.container');


const urlParams = new URLSearchParams(window.location.search);
const clickedProductId = urlParams.get('id');
if(!clickedProductId){
    window.location = "/not-found.html";
}

let basketStorage = JSON.parse(localStorage.getItem('basket')) || [];
function saveProductToBasket(){
    return localStorage.setItem('basket',JSON.stringify(basketStorage));
}

let productsStorage = JSON.parse(localStorage.getItem('products'));

async function fetchDummyJson(endpoint){
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const items = await response.json();
    return items;
}

async function listProduct(){
    const product = await fetchDummyJson(`products/${clickedProductId}`);
    const title = document.querySelector('title');
    title.textContent = `${product.brand} - ${product.title}`;
    container.innerHTML = 
    `
    <div class="product-container">
        <div class="product-left-side-container">
            <div class="big-image-container">
                <img class="big-image" src="${product.images[0]}" alt="">
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
                <div class="quantity-container">
                    <a href="#" class="quantity-down">-</a>
                    <strong class="quantity-content" data-productid=${product.id}>${basketStorage.filter(item => item.id == product.id).shift()?.quantity ?? "0"}</strong>
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
        <img class="small-image" src="${image}" alt="">
        `
    }
    document.querySelector(".small-image").classList.add('current-image');
    
    bindEvents(".quantity-up",".quantity-content","click",product.stock,quantityUp)
    bindEvents(".quantity-down",".quantity-content","click",product.stock,quantityDown)
    bindEvents('.big-btn',".quantity-content","click",product.stock,addToBasket);
    bindImages(".small-image",".big-image","click",selectedImage);
}

function bindEvents(selector , totalQuantity, eventType,stock,cbFunction){
    const element = document.querySelector(selector);
    element.addEventListener(eventType ,(e) => cbFunction(e, totalQuantity, stock))
}

function quantityUp(e,totalQuantity,stock){
    e.preventDefault();
    const quantityContent = document.querySelector(totalQuantity);
    if(Number(quantityContent.textContent) >= stock ){
        return
    }
    quantityContent.textContent = Number(quantityContent.textContent) + 1 ;
}

function quantityDown(e,totalQuantity){
    e.preventDefault();
    const quantityContent = document.querySelector(totalQuantity);
    if(!Number(quantityContent.textContent) > 0){
        return
    }
    quantityContent.textContent = Number(quantityContent.textContent) - 1 ;
}

function addToBasket(e,totalQuantity){
    e.preventDefault();
    const quantityContent = document.querySelector(totalQuantity);
    let isFound = false;
    for (const basket of basketStorage) {
        if(basket.id == quantityContent.dataset.productid && Number(quantityContent.textContent) > 0){
            isFound = true;
            basket.quantity = Number(quantityContent.textContent);
            break;
        }
    }
    if(!isFound && Number(quantityContent.textContent) > 0){
        basketStorage.push({
            id:Number(clickedProductId),
            quantity: Number(quantityContent.textContent)
        })
    }
    saveProductToBasket();
    showSuccessMessage();
}

function bindImages(smallImage,bigImage,eventType,cbFunction){
    const smallImages = document.querySelectorAll(smallImage);
    const currentImage = document.querySelector(bigImage);
    for (const image of smallImages) {
        image.addEventListener(eventType,(e) => cbFunction(e,currentImage,smallImages));
    }
}

function selectedImage(e,currentImage,smallImages){
    for (const image of smallImages) {
        image.classList.remove('current-image')
    }
    currentImage.src = e.target.src;
    e.target.classList.add('current-image')
}

function showSuccessMessage(){
    const messageBox = document.querySelector('.message-box');
    messageBox.innerHTML += '<div class="message">Ürün Sepete Eklendi!</div>';
    messageBox.style.display = "block";
    setTimeout(function() {
        messageBox.style.opacity = "0";
        messageBox.innerHTML = "";
        setTimeout(function() {
            messageBox.style.display = "none";
            messageBox.style.opacity = "1";
        }, 1000);
    }, 3000);
}

listProduct();