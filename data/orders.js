/**
 * A list of all saved orders, loaded from localStorage.
 * If no orders are found, an empty array is used by default.
 * 
 * @type {Array<Object>}
 */
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

/**
 * Adds a new order to the beginning of the orders array
 * and saves it to localStorage.
 * 
 * @param {Object} order - The order object to add.
 */
export function addOrder(order) {
    orders.unshift(order); // adds to the beginning of the array
    saveToStorage();
}

/**
 * Saves the current list of orders to localStorage.
 * This function is internal and not exported.
 */
function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Retrieves a single order by its ID.
 * 
 * @param {string} orderId - The unique identifier of the order.
 * @returns {Object|undefined} - The matching order, or undefined if not found.
 */
export function getOrderById(orderId) {
    let matchingOrder;

    orders.forEach((order) => {
        if(order.id === orderId) {
            matchingOrder = order;
        }
    });

    return matchingOrder;
}