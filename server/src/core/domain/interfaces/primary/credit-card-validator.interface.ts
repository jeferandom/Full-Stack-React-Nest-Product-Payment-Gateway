export interface ICreditCardValidator {
  validateCard(cardNumber: string): boolean;
  identifyCardType(cardNumber: string): string | null;
  isValidLength(cardNumber: string): boolean;
}
