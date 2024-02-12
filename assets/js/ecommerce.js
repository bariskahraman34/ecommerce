const BASE_URL = "https://dummyjson.com";
const productPage = document.querySelector('.product-page');

async function fetchDummyJson(endpoint){
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const items = await response.json();
    return items;
}

async function listProducts(){
    const items = await fetchDummyJson("products?limit=100");
    const products = items.products;
    console.log(products);
    for (const product of products) {
      productPage.innerHTML += 
        `
        <div class="product-col-3">
            <a href="product-page.html" class="product">
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
                        <div class="ratings">
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
            </a>
        </div>
        `
    }
}

listProducts();