const removeCartItemButtons = document.getElementsByClassName('btn-danger');
for(let i =0; i< removeCartItemButtons.length; i++){
    let button = removeCartItemButtons[i];
    button.addEventListener('click', (e) => {
       const btnClicked = e.target
       btnClicked.parentElement.parentElement.remove();
        updateCartTotal();
    })

}
const updateCartTotal = () => {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRow = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;

    for(let i = 0; i < cartRows.length; i++){
        let cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replacd('$', ''));
        const quantity = quantityElement.value;
        total = total + (price * quantity);

    }
    document.getElementsByClassName('cart-total-price')[0].innerText = `$ ${total}`;

}