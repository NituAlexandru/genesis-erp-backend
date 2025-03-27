export function calculateSalePrice(averagePurchasePrice, markup) {
  return averagePurchasePrice * (1 + markup / 100);
}
