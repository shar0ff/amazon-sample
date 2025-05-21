import {renderOrderSummary} from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

/**
 * Initializes the checkout page by:
 * - Loading product data from the backend
 * - Rendering the order summary section
 * - Rendering the payment summary section
 *
 * If product loading fails, an error is logged.
 */
async function loadPage() {
    try {
        await loadProducts();
        renderOrderSummary();
        renderPaymentSummary();
    } catch(error) {
        console.log("An error occurred while products loading!")
    }
}

// Kick off the page load
loadPage();