export function formatPrice(cents){
  if (cents == null) return '$0.00'
  return `$${(cents/100).toFixed(2)}`
}
