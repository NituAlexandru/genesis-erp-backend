export function calculateSalePrice(basePrice, markupPercent, vatRate) {
  const markup = markupPercent / 100; // conversie la fracție
  // Calculăm prețul de bază cu markup și apoi aplicăm TVA-ul
  return basePrice * (1 + markup) * (1 + vatRate);
}

export function calculateSalePrice(basePrice, markup, vatRate) {
  return basePrice * (1 + markup) * (1 + vatRate);
}
