import {cart} from "../../data/cart.js";

describe('Test suite: addToCart', () => {

    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });

    it('Adds an existing product to the cart', () => {
        cart.cartItems = [{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1,
            deliveryOptionId: '1'
        }];

        cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.cartItems[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity: 2,
                deliveryOptionId: "1"
        }]));
    });

    it('Adds a new product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });

        cart.cartItems = [];

        cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.cartItems[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart.cartItems[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity: 1,
                deliveryOptionId: "1"
        }]));
    });
});

describe('Test suite: deleteFromCart', () => {

    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        cart.cartItems = [{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1,
            deliveryOptionId: '1'
        }];
    });

    it('Delete a product that is in the cart', () => {
        cart.deleteFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

        expect(cart.cartItems.length).toEqual(0);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
    });

    it('Delete a product that is not in the cart', () => {
        cart.deleteFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6-not-existing-id");

        expect(cart.cartItems.length).toEqual(1);
        expect(cart.cartItems[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart.cartItems[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 1,
            deliveryOptionId: "1"
        }]));
    });
});

describe("Test suite: updateDeliveryOption", () => {

    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        cart.cartItems = [{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1,
            deliveryOptionId: '1'
        }];
    });

    it('Update deleviryOptionId for an existing product', () => {
        cart.updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", '2');

        expect(cart.cartItems.length).toEqual(1);
        expect(cart.cartItems[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart.cartItems[0].quantity).toEqual(1);
        expect(cart.cartItems[0].deliveryOptionId).toEqual("2");
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 1,
            deliveryOptionId: '2'
        }]));
    });

    it('Does nothing when trying to update deliveryOptionId for product that is not in the cart', () => {
        cart.updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6-not-existing", '2');
        expect(cart.cartItems.length).toEqual(1);
        expect(cart.cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart.cartItems[0].quantity).toEqual(1);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
});