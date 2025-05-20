class Cart {
  cartItems = undefined;
  #localStorageKey = undefined;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if (!this.cart) {
      this.cart = [];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, productQuantity){
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.productQuantity += productQuantity;
    } else {
      this.cartItems.push({
        productId,
        productQuantity,
        deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  deleteFromCart (productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    })

    this.cartItems = newCart;
    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.productQuantity;
    });

    return cartQuantity;
  }

  updateCartQuantity() {
    const cartQuantity = this.calculateCartQuantity();
    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
  }

  updateProductQuantity(productId, newQuantity) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.productQuantity = newQuantity;
    this.saveToStorage();
  }

  updateDeliveryOption (productId, deliveryOptionId) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if(matchingItem) {
      matchingItem.deliveryOptionId = deliveryOptionId;
      this.saveToStorage();
    } else {
      return;
    }  
  }
}