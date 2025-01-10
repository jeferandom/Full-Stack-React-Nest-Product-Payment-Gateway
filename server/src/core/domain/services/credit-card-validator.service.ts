import { Injectable } from '@nestjs/common';

@Injectable()
export class CreditCardValidatorService {
  private readonly cardPatterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
  };

  validateCard(cardNumber: string): boolean {
    // Remove any spaces or special characters
    const cleanNumber = cardNumber.replace(/\D/g, '');

    // Check if the number matches any known card pattern
    if (!this.identifyCardType(cleanNumber)) {
      return false;
    }

    // Validate using Luhn algorithm
    return this.luhnCheck(cleanNumber);
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the right
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  identifyCardType(cardNumber: string): string | null {
    for (const [type, pattern] of Object.entries(this.cardPatterns)) {
      if (pattern.test(cardNumber)) {
        return type;
      }
    }
    return null;
  }

  isValidLength(cardNumber: string): boolean {
    const length = cardNumber.replace(/\D/g, '').length;
    return length >= 13 && length <= 16;
  }
}
