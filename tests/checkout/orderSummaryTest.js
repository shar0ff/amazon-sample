import {renderOrderSummary} from "../../scripts/checkout/orderSummary.js";
import {cart} from "../../data/cart.js";
import { getProductById } from "../../data/products.js";
import { formatCurrency } from "../../scripts/helpers/currency.js";
import { loadProducts } from "../../data/products.js";

describe('Test suite: renderOrderSummary', () => {

    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";
    let productName1;
    let productName2;
    let productPrice1;
    let productPrice2;

    beforeAll((done) => {
        loadProducts().then(() => {
            done();
            productName1 = getProductById(productId1).name;
            productName2 = getProductById(productId2).name;
            productPrice1 = `$${formatCurrency(getProductById(productId1).priceCents)}`;
            productPrice2 = `$${formatCurrency(getProductById(productId2).priceCents)}`;
        });
    });

    beforeEach(() => {
        document.querySelector(".js-test-container").innerHTML = `
            <div class="js-order-summary"></div>
            <div class="js-return-to-home-link"></div>
            <div class="js-payment-summary"></div>
        `;

        spyOn(localStorage, 'setItem');

        cart.cartItems = [{
        productId: productId1,
        productQuantity: 2,
        deliveryOptionId: '1'
        }, {
        productId: productId2,
        productQuantity: 1,
        deliveryOptionId: '2'
        }];

        renderOrderSummary();
    });

    afterEach(() => {
        document.querySelector(".js-test-container").innerHTML = ``;
    });

    it('Displays the cart', () => {
        expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(2);
        expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');
        expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
        expect(document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual(productName1);
        expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual(productName2);
        expect(document.querySelector(`.js-product-price-${productId1}`).innerText).toEqual(productPrice1);
        expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual(productPrice2);
    });

    it('Deletes the product when the delete link is clicked', () => {
        document.querySelector(`.js-delete-link-${productId1}`).click();

        expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(1);
        expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
        expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);
        expect(cart.cartItems.length).toEqual(1);
        expect(cart.cartItems[0].productId).toEqual(productId2);
    });

    it('Updates delivery option', () => {
        document.querySelector(`.js-delivery-option-${productId1}-3`).click();

        expect(document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked).toEqual(true);
        expect(cart.cartItems.length).toEqual(2);
        expect(cart.cartItems[0].productId).toEqual(productId1);
        expect(cart.cartItems[0].deliveryOptionId).toEqual("3");
        expect(document.querySelector(".js-shipping-price").innerText).toEqual("$14.98");
        expect(document.querySelector(".js-total-price").innerText).toEqual("$63.50");
    });
});