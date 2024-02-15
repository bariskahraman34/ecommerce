const BASE_URL = "https://dummyjson.com";
const productPage = document.querySelector('.product-page');

async function fetchDummyJson(endpoint){
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const items = await response.json();
    return items;
}

async function postItems(endpoint, bodyObject){
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObject)
    });
    const items = await response.json();
    return items;
}
  
async function putItems(endpoint, bodyObject){
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObject)
    });
    const updatedItem = await response.json();
    return updatedItem;
}

async function deleteItems(endpoint){
    const response = await fetch(`${BASE_URL}/${endpoint}`,{
        method : "DELETE"
    })
    const deletedItem = await response.json();
    return deletedItem
}

async function listProducts(){
    const items = await fetchDummyJson("products");
    const products = items.products;
    for (const product of products) {
        productPage.innerHTML += 
            `
            <div class="product-col-3 user-products">
                <div class="product update-page" data-productid=${product.id}>
                    <div class="image-container">
                        ${product.discountPercentage ? `<b class="badge-sale">SALE</b>` : ""}
                        <img src="${product.thumbnail}" alt="">
                    </div>
                    <div class="product-info-area">
                        <div class="product-brand-description">
                            <span class="brand">${product.brand}</span>
                            <span class="name">${product.title}</span>
                        </div>
                        <div class="rating-container">
                            <div class="rating-score">${product.rating}</div>
                            <div class="ratings" data-productid=${product.id}>
                                <div class="star">
                                    <i class="fa-regular fa-star"></i>
                                </div>
                                <div class="star">
                                    <i class="fa-regular fa-star"></i>
                                </div>
                                <div class="star">
                                    <i class="fa-regular fa-star"></i>
                                </div>
                                <div class="star">
                                    <i class="fa-regular fa-star"></i>
                                </div>
                                <div class="star">
                                    <i class="fa-regular fa-star"></i>
                                </div>
                            </div>
                        </div>
                        <div class="price-wrapper">
                            ${product.discountPercentage ? `
                            <b class="badge-old-price">$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</b>
                            `:""}
                            
                            <b class="badge-new-price">$${product.price}</b>
                        </div>
                    </div>
                </div>
                <div class="user-btn-container">                 
                    <button class="user-btn edit-btn" data-productid="${product.id}">Düzenle</button>
                    <button class="user-btn delete-btn" data-productid="${product.id}">Sil</button>
                </div>
            </div>
            `;
            ratingProduct(product.rating,product.id);
            bindEvents(".edit-btn", "click", editProduct);
            bindEvents(".delete-btn", "click", deleteProduct);
    }
}

function bindEvents(selector, eventType, cbFunction){
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      element.addEventListener(eventType, cbFunction)
    }
    
}

async function editProduct(e){
    const productId = parseInt(e.target.dataset.productid);
    const newForm = 
    `
    <form id="change-title-form">
        <label for="title">Title:</label><br>
        <input type="text" id="title" name="title"><br>
        <button class="submit-btn">Değiştir</button>
    </form>
    `;
    let targetElement = e.target.parentElement.previousElementSibling.querySelector('.name');
    targetElement.innerHTML = newForm;
    const changeTitleForm = document.querySelector('#change-title-form');
    changeTitleForm.addEventListener('submit',e => changeTitle(e,productId));

}

async function changeTitle(e,productId){
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const updatedProduct = await putItems(`products/${productId}`, {
        title: formObj.title,
    })
    e.target.parentElement.innerHTML = updatedProduct.title;
}
  
async function deleteProduct(e){
    const productId = parseInt(e.target.dataset.productid);
    const response = await deleteItems(`products/${productId}`);
    console.log(response);
    e.target.parentElement.parentElement.remove();
}

async function addProduct(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const response = await postItems("products/add", formObj);
    console.log(response);
    const product = await response;
    productPage.innerHTML += 
    `
    <div class="product-col-3 user-products">
        <div class="product update-page" data-productid=${product.id}>
            <div class="image-container">
                ${product.discountPercentage ? `<b class="badge-sale">SALE</b>` : ""}
                <img src="https://fastly.picsum.photos/id/668/300/300.jpg?hmac=HLROXo5TChrai69D04nx0w8LRY2wNmqKlHB7cNkKpFw" alt="">
            </div>
            <div class="product-info-area">
                <div class="product-brand-description">
                    <span class="brand">${product.brand}</span>
                    <span class="name">${product.title}</span>
                </div>
                <div class="rating-container">
                    <div class="rating-score">5</div>
                    <div class="ratings" data-productid=${product.id}>
                        <div class="star">
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class="star">
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class="star">
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class="star">
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class="star">
                            <i class="fa-regular fa-star"></i>
                        </div>
                    </div>
                </div>
                <div class="price-wrapper">
                    ${product.discountPercentage ? `
                    <b class="badge-old-price">$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</b>
                    `:""}
                    
                    <b class="badge-new-price">$${product.price}</b>
                </div>
            </div>
        </div>
        <div class="user-btn-container">                 
            <button class="user-btn edit-btn" data-productid="${product.id}">Düzenle</button>
            <button class="user-btn delete-btn" data-productid="${product.id}">Sil</button>
        </div>
    </div>
    `
    e.target.reset();
}

const addProductForm = document.querySelector("#add-product-form");
addProductForm.addEventListener("submit", addProduct);

function ratingProduct(rating,productId){
    const ratingStar = document.querySelectorAll(`.ratings[data-productid="${productId}"] .star`);
    for (let i = 0; i < Math.ceil(rating) ; i++) {
        ratingStar[i].innerHTML = `<i class="fa-solid fa-star"></i>`
    }
}

listProducts();