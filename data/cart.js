/**
 * A shopping cart class that manages cart items and synchronizes them with localStorage.
 */

class Cart {
  cartItems = undefined;
  #localStorageKey = undefined;

  /**
   * Creates a new Cart instance and loads items from localStorage.
   * @param {string} localStorageKey - The key under which the cart data is stored in localStorage.
   */
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  /**
   * Loads the cart data from localStorage into memory.
   * Private method.
   */
  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }

  /**
   * Saves the current cart state to localStorage.
   */
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  /**
   * Adds a product to the cart. If the product is already in the cart, increases its quantity.
   * @param {string} productId - The ID of the product to add.
   * @param {number} quantity - The quantity to add.
   */
  addToCart(productId, quantity){
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1' // Default delivery option
      });
    }

    this.saveToStorage();
  }

  /**
   * Removes a product from the cart by its product ID.
   * @param {string} productId - The ID of the product to remove.
   */
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

  /**
   * Clears all items from the cart.
   */
  resetCart() {
    this.cartItems = [];
    this.saveToStorage();
  }

  /**
   * Calculates the total quantity of items in the cart.
   * @returns {number} - The total quantity of products in the cart.
   */
  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  /**
   * Updates the cart quantity displayed in the UI.
   * Assumes there is an element with class `.js-cart-quantity` in the DOM.
   */
  updateCartQuantity() {
    const cartQuantity = this.calculateCartQuantity();
    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
  }

  /**
   * Updates the quantity of a specific product in the cart.
   * @param {string} productId - The ID of the product.
   * @param {number} newQuantity - The new quantity to set.
   */
  updatequantity(productId, newQuantity) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }

  /**
   * Updates the delivery option for a specific product in the cart.
   * @param {string} productId - The ID of the product.
   * @param {string} deliveryOptionId - The ID of the new delivery option.
   */
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

// Export a singleton cart instance using localStorage key 'cart'
export const cart = new Cart('cart');