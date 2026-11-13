var swiper = new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,

    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    }
});


const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');


cartIcon.addEventListener('click', ()=> cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', ()=> cartTab.classList.remove('cart-tab-active'));

let productList = [];
let cartProduct = [];

const updateTotals = () => {

        let totalPrice = 0;
        let totalQuantity = 0;
        
        document.querySelectorAll('.item').forEach(item => {

            const quantity = parseInt(item.querySelector('.quantity-value').textContent);
            const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));
            
            totalPrice += price;
            totalQuantity += quantity;
        });

        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        cartValue.textContent = totalQuantity;
}

const showCards = () => {

    productList.forEach(product =>{

        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn card-btn">Add To Cart</a>
        `;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click',(e) => {
            
            e.preventDefault();
            AddToCart(product);
        })
    })
}

const AddToCart = (product) => {
    const existingProduct = cartProduct.find(item => item.id === product.id);
    if(existingProduct){

        alert('item in olready your card!');
        return;
    }

    cartProduct.push(product);
    let quantity = 1;
    let price = parseFloat(product.price.replace('$',''));

    const cartItem = document.createElement('div');
   
    cartItem.classList.add('item');

    cartItem.innerHTML = `
    <div class="item-image">
        <img src="${product.image}">
    </div>
        <div>
            <h4>${product.name}</h4>
            <h4 class="item-total">${product.price}</h4>
        </div>
            <div class="flex">
                <a href="#" class="quantity-btn minus">
                    <i class="fa-solid fa-minus"></i>
                </a>
                <h4 class="quantity-value">${quantity}</h4>
                <a href="#" class="quantity-btn plus">
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
    `;
   
    cartList.appendChild(cartItem);
    updateTotals();

    const plusBtn = cartItem.querySelector('.plus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');

    plusBtn.addEventListener('click' , (e)=> {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
        updateTotals();
    })

    const minusBtn = cartItem.querySelector('.minus');

    minusBtn.addEventListener('click' , (e)=> {
        e.preventDefault();
        if(quantity > 1){
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
            updateTotals();
        }
        else{
            cartItem.classList.add('slide-out')
            
            setTimeout(() => {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotals();
            }, 300);
        }
        
    })

}

const initApp = () => { 

    fetch('./product.json')
        .then (response => {
            if(!response.ok) {
                throw new Error(`File not found: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Products loaded:", data);
            productList = data;
            showCards();
        })
        .catch(error => console.error("Error:", error));
};


document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const card = btn.closest('.order-card');

        const product = {
            id: card.dataset.id,
            image: card.querySelector('img').src,
            name: card.querySelector('h4').textContent,
            price: card.querySelector('.price').textContent
        };

        AddToCart(product);
    });
});

initApp();

