export const cart = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    productQuantity: 1000
  }
];

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
}