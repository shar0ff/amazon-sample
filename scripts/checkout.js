import {renderOrderSummary} from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

async function loadPage() {
    try {
        await loadProducts();
        renderOrderSummary();
        renderPaymentSummary();
    } catch(error) {
        console.log("An error occurred while products loading!")
    }
}
loadPage();