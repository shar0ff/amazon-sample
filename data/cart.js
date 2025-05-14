export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [];
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, productQuantity){
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.productQuantity += productQuantity;
  } else {
    cart.push({
      productId,
      productQuantity
    })
  }

  saveToStorage();
}

export function deleteFromCart (productId) {

  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  })

  cart = newCart;
  saveToStorage();
}