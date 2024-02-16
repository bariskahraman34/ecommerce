const basketBtn = document.querySelector('.basket-btn');
const basketResult = document.querySelector('.basket-result');
const basketQuantity = document.querySelector('.basket-quantity');

let productsSaved = JSON.parse(localStorage.getItem('products')) || [];
let basketResultInfos = [];
let basketQuantityTotal = 0;

basketQuantity.innerHTML = `${basketQuantityTotal}`

basketBtn.addEventListener('click',calculateBasket);

function calculateBasket(){
    basketResult.classList.add("show");
    let basketSaved = JSON.parse(localStorage.getItem('basket')) || [];
    basketResult.innerHTML = 
    `
    <div class="cart-header">
        <button class="close-offcanvas-btn"><i class="fa-solid fa-xmark fa-2x"></i></button>
        <h3>Cart</h3>
    </div>
    `;
    if(basketSaved.length == 0){
        basketResult.innerHTML +=`<div class="empty-cart">Sepetiniz boş.</div>`
    }
    basketResultInfos = []
    // basketResultInfos = productsSaved.filter(item => basketSaved.filter(product => item.id == product.id).length > 0);
    
    for (const basket of basketSaved) {
        for (const product of productsSaved) {
            if(basket.id == product.id){
                basketResultInfos.push(
                    {
                        id:basket.id,
                        title: product.title,
                        quantity: basket.quantity,
                        productPrice:product.price,
                        totalPrice: basket.quantity * product.price,
                        image: product.thumbnail
                    }
                    );
                }
            }
    }
    
    for (const basket of basketResultInfos) {
        basketResult.innerHTML += 
        `
        <div class="cart-body" data-productid=${basket.id}>
            <div class="cart-container">            
                <img src="${basket.image}" width="50px" height="50px">
                <div class="cart-infos">
                    <div>
                        <span class="thin-text">${basket.title}</span>
                    </div>
                    <div> 
                        <span class="product-price thin-text">$${basket.productPrice}</span>
                        <span class="thin-text">x</span>
                        <span class="thin-text">${basket.quantity}</span>
                        <span class="bold-text">$${basket.totalPrice}</span>
                    </div>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${basket.id})" ><img class="del-icon" src="assets/icons/del-icon.svg"/></button>
        </div>
        `;
    }
    if(basketResultInfos.length > 0){
        basketResult.innerHTML += 
        `
        <div class="checkout-btn-div">
            <button class="checkout-btn">Checkout</button>
        </div>
        `;
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn.addEventListener('click',doneCheckout);
    }
    const closeCanvasBtn = document.querySelector('.close-offcanvas-btn');
    closeCanvasBtn.addEventListener('click',closeCanvas);
    calculateBasketQuantity();
}

function calculateBasketQuantity(){
    let basketSaved = JSON.parse(localStorage.getItem('basket')) || [];
    basketQuantityTotal = 0;
    if(basketSaved.length > 0){
        for (const basket of basketSaved) {
            basketQuantityTotal += basket.quantity;
        }
        const basketQuantity = document.querySelector('.basket-quantity');
        basketQuantity.innerHTML = basketQuantityTotal;
    }else{
        basketQuantity.innerHTML = "0"
    }
}

function deleteProduct(id){
    if(document.querySelector('.dialog')){
        document.querySelector('.dialog').remove();
    }
    const modal = 
    `
    <dialog class="dialog">
        <h3>Delete Product</h3>
        <p>Are you sure you want to delete this product? This will remove the product and can’t be undone.
        </p>
        <div class="dialog-buttons">
            <button id="no" class="dialog-btn">no,cancel</button>
            <button id="yes" class="dialog-btn">yes,delete</button>
        </div>
    </dialog>
    `;
    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend',modal);
    document.querySelector('.dialog').showModal();
    const dialogBtns = document.querySelectorAll('.dialog-btn');
    for (const btn of dialogBtns) {
        btn.addEventListener('click',function(){
            document.querySelector('.dialog').close();
            if(btn.id == "yes"){
                let basketSaved = JSON.parse(localStorage.getItem('basket')) || [];
                let findProduct = basketSaved.findIndex(item => {
                    return item.id === Number(id)
                })
                if(findProduct !== -1){
                    basketSaved.splice(findProduct,1);
                    localStorage.setItem('basket',JSON.stringify(basketSaved));
                    listProduct();
                    calculateBasket();
                    showSuccessMessage("removed");
                }
            }
        })
    }
}
function closeCanvas(){
    basketResult.classList.remove("show");
}

window.addEventListener('click',function(e){
    if(!basketResult.contains(e.target) && !basketBtn.contains(e.target)){
        basketResult.classList.remove('show');
    }
})

function doneCheckout(){
    localStorage.removeItem('basket');
    closeCanvas();
    if(document.querySelector('.dialog')){
        document.querySelector('.dialog').remove();
    }
    const modal = 
    `
    <dialog class="dialog success-message-dialog">
        <h3>Purchase Successful!</h3>
        <div><i class="fa-solid fa-circle-check fa-bounce" style="color: #0d8251;"></i></div>
        <p>
            Success! Your transaction has been completed successfully
        </p>
        <button class="close-modal">Close</button>
    </dialog>
    `;
    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend',modal);
    setTimeout(function(){
        document.querySelector('.dialog').showModal();
    },2000)
    const modalCloseBtn = document.querySelector('.close-modal');
    modalCloseBtn.addEventListener('click',closeModal);
    return calculateBasket();
}

function closeModal(){
    const modal = document.querySelector('.success-message-dialog');
    modal.close();
}

calculateBasketQuantity();