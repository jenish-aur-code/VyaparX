/**
 * Indian currency & Date formatting utilities matching Sauda Book UI
 */

export function formatCurrency(amount: number, decimals: number = 2): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0.00';
  }
  
  const numStr = amount.toFixed(decimals);
  const [integerPart, decimalPart] = numStr.split('.');
  
  // Indian numbering system format (last 3 digits, then pairs of 2 digits)
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return decimals > 0 
    ? `₹${formattedInteger}.${decimalPart}`
    : `₹${formattedInteger}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  // handles YYYY-MM-DD or ISO string to DD/MM/YYYY
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

export function formatISODate(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
