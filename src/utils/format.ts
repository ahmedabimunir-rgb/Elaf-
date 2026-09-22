export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ETB';
  }
  return `${amount.toLocaleString()} ETB`;
}
