export const DisplayPriceInRupees  = (price) => {
    const formattedPrice = new Intl.NumberFormat('en-ET', {
        style: 'currency',
        currency: 'ETB',
        currencyDisplay: 'code' // Use 'code' to get the currency code
    }).format(price);

    // Move the currency code to the end
    return formattedPrice.replace('ETB', '').trim() + ' ETB';
}