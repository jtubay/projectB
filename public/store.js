
const removeCartItemButtons = document.getElementsByClassName('btn-danger');
const quantityInputs = document.getElementsByClassName('btn-danger');
const addToCartBtn = document.getElementsByClassName('shop-item-button');


const stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: (token) => {
        const items = [];
        const cartItemContainer = document.getElementsByClassName('cart-items')[0];
        const cartRows = cartItemContainer.getElementsByClassName('cart-row');
        for(let i =0; i < cartRows.length; i++){
            let cartRow = cartRows[i];
            const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
            const quantity = quantityElement.value;
            const id = cartRow.dataset.itemId;
            items.push({
                id,
                quantity
            })
        }
        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items
            })
        }).then((res)=>{
            return res.json()
        }).then((data) => {
            alert(data.message)
            var cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
        }).catch((error) =>{
            console.error(error);
        })

        
    }
})



function purchaseClicked() {
    // alert('Thank you for your purchase')

    const priceElement = document.getElementsByClassName('cart-total-price')[0];
    const price = parseFloat(priceElement.innerText.replace("$", "")) * 100;
    stripeHandler.open({
        amount: price
    })
}
document.getElementsByClassName('btn-purchase')[0].addEventListener('click',purchaseClicked);

const removeCartItem = e => {
    const btnClicked = e.target
    btnClicked.parentElement.parentElement.remove();
     updateCartTotal();
}
const quantityChanged = e => {
    const input = e.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateCartTotal()

}
const addItemToCart = (title, price, imageSrc, id) => {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.dataset.itemId = id;

    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for(let i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            alert('This item is already added to the cart');
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

const addToCartClicked = e =>{
    const button = e.target;
    const shopItem = button.parentElement.parentElement;
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    
    const id = shopItem.dataset.itemId
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}


for(let i =0; i< removeCartItemButtons.length; i++){
    let button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem)
}
for(let i =0; i < quantityInputs.length; i++){
    let input = quantityInputs[i];
    input.addEventListener('change', quantityChanged)
}

for(let i = 0; i < addToCartBtn.length; i++){
    let button = addToCartBtn[i];
    button.addEventListener('click', addToCartClicked)
}


const updateCartTotal = () => {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;

    for(let i = 0; i < cartRows.length; i++){
        let cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        total = total + (price * quantity);

    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = `$ ${total}`;

}