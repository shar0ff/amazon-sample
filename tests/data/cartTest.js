import {cart, addToCart, loadFromStorage, deleteFromCart, updateDeliveryOption} from "../../data/cart.js";

describe('Test suite: addToCart', () => {

    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });

    it('Adds an existing product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                productQuantity: 1,
                deliveryOptionId: "1"
            }]);
        });

        loadFromStorage();

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].productQuantity).toEqual(2);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                productQuantity: 2,
                deliveryOptionId: "1"
        }]));
    });

    it('Adds a new product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });

        loadFromStorage();

        addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", 1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].productQuantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                productQuantity: 1,
                deliveryOptionId: "1"
        }]));
    });
});

describe('Test suite: deleteFromCart', () => {

    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                productQuantity: 1,
                deliveryOptionId: "1"
            }]);
        });

        loadFromStorage();
    });

    it('Delete a product that is in the cart', () => {
        deleteFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

        expect(cart.length).toEqual(0);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
    });

    it('Delete a product that is not in the cart', () => {
        deleteFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6-not-existing-id");

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].productQuantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            productQuantity: 1,
            deliveryOptionId: "1"
        }]));
    });
});

describe("Test suite: updateDeliveryOption", () => {

    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                productQuantity: 1,
                deliveryOptionId: "1"
            }]);
        });

        loadFromStorage();
    });

    it('Update deleviryOptionId for an existing product', () => {
        updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6", '2');

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
        expect(cart[0].productQuantity).toEqual(1);
        expect(cart[0].deliveryOptionId).toEqual("2");
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            productQuantity: 1,
            deliveryOptionId: '2'
        }]));
    });

    it('Does nothing when trying to update deliveryOptionId for product that is not in the cart', () => {
        updateDeliveryOption("e43638ce-6aa0-4b85-b27f-e1d07eb678c6-not-existing", '2');
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart[0].productQuantity).toEqual(1);
        expect(cart[0].deliveryOptionId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
});