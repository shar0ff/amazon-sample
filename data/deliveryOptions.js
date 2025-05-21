import  dayjs from 'https://unpkg.com/dayjs@1.11.9/esm/index.js';

/**
 * Retrieves a delivery option object by its ID.
 *
 * @param {string} deliveryOptionId - The ID of the delivery option to retrieve.
 * @returns {Object} - The matching delivery option object, or the default option if not found.
 */
export function getDeliveryOptionById(deliveryOptionId) {
    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });

    return deliveryOption || deliveryOptions[0];
}

/**
 * Calculates the estimated delivery date based on the selected delivery option.
 *
 * @param {Object} deliveryOption - A delivery option object that contains `deliveryDays`.
 * @returns {string} - A formatted date string like "Tuesday, May 21".
 */
export function calculateDeliveryDate(deliveryOption) {
    return dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');
} 

/**
 * List of available delivery options.
 * Each option includes:
 * - `id`: Unique identifier for the option
 * - `deliveryDays`: Estimated delivery time in days
 * - `priceCents`: Cost in cents
 */
export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
}, {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
}, {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
}];