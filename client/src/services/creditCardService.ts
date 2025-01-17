import { Result, ApiError } from "../utils/errors";

interface CardToken {
  id: string;
  created_at: string;
  brand: string;
  last_four: string;
  exp_year: string;
  exp_month: string;
  card_holder: string;
  created_with_cvc: boolean;
}

interface CardValidationResponse {
  isValid: boolean;
  cardType: string;
  hasValidLength: boolean;
  error?: {
    type: string;
    messages: {
      [key: string]: string[];
    };
  };
  token?: {
    status: string;
    data: CardToken;
  };
}

export interface CardTokenRequest {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

interface CardTokenResponse {
  tokenId: string;
  lastFour: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const tokenize = async ({
  number,
  cvc,
  exp_month,
  exp_year,
  card_holder,
}: CardTokenRequest): Promise<Result<CardTokenResponse>> => {
  try {
    // Validate any empty field
    if (!number || !cvc || !exp_month || !exp_year || !card_holder) {
      return {
        success: false,
        error: new ApiError(400, "Empty field", "INVALID_INPUT"),
      };
    }

    const response = await fetch(`${API_URL}/credit-card/tokenize`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ number, cvc, exp_month, exp_year, card_holder }),
    });

    const data: CardValidationResponse = await response.json();

    if (!response.ok || data.error) {
      const errorMessage = data.error
        ? Object.values(data.error.messages).flat().join(". ")
        : "The card data provided is invalid";

      return {
        success: false,
        error: new ApiError(
          response.status,
          errorMessage,
          data.error?.type || "API_ERROR"
        ),
      };
    }

    if (!data.isValid || !data.token) {
      return {
        success: false,
        error: new ApiError(
          400,
          "The card data provided is invalid",
          "VALIDATION_ERROR"
        ),
      };
    }

    return {
      success: true,
      data: {
        tokenId: data.token.data.id,
        lastFour: data.token.data.last_four,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      // Propagar el error de abort para manejo específico
      throw err;
    }
    return {
      success: false,
      error: new ApiError(500, "Internal error", "UNKNOWN_ERROR"),
    };
  }
};

export class CreditCardValidatorService {
  private readonly cardPatterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
  };

  validateCard(cardNumber: string): boolean {
    // Remove any spaces or special characters
    const cleanNumber = cardNumber.replace(/\D/g, "");

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
    const length = cardNumber.replace(/\D/g, "").length;
    return length >= 13 && length <= 16;
  }
}
