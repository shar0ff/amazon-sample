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
      productQuantity,
      deliveryOptionId: '1'
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

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.productQuantity;
  });

  return cartQuantity;
}

export function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

export function updateProductQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.productQuantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption (productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}