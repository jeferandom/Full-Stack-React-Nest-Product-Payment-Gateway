export interface CreditCardErrorResponse {
  error: {
    type: string;
    messages: {
      [key: string]: string[];
    };
  };
}

export interface TokenizationResponse {
  isValid: boolean;
  cardType: string | null;
  hasValidLength: boolean;
  token?: any;
  error?: {
    type: string;
    messages: {
      [key: string]: string[];
    };
  };
}
