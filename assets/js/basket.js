const basketBtn = document.querySelector('.basket-btn');
const basketResult = document.querySelector('.basket-result');

let productsSaved = JSON.parse(localStorage.getItem('products')) || [];
let basketResultInfos = [];

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
                <button class="delete-btn"><img class="del-icon" src="assets/icons/del-icon.svg"/></button>
            </div>
            `;
        }
        bindDeleteBtns();
        document.querySelector('.close-offcanvas-btn').addEventListener('click',closeCanvas);
    }
    
    function bindDeleteBtns(){
        const deleteBtns = document.querySelectorAll('.delete-btn');
    for (const btn of deleteBtns) {
        btn.addEventListener('click',deleteProduct);
    }
}

function deleteProduct(e){
    const answer = confirm('Silmek istediğinize emin misiniz ?');
    if(answer){
        let basketSaved = JSON.parse(localStorage.getItem('basket')) || [];
        let findProduct = basketSaved.findIndex(item => {
            return item.id === Number(e.target.parentElement.parentElement.dataset.productid)
        })
        if(findProduct !== -1){
            basketSaved.splice(findProduct,1);
            localStorage.setItem('basket',JSON.stringify(basketSaved));
            console.log('Eleman Kaldırıldı');
            return calculateBasket();
        }
    }
}

function closeCanvas(){
    basketResult.classList.remove("show");
}