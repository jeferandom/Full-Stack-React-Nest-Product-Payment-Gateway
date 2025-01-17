export class PaymentTransactionDto {
  payment_method: {
    type: string;
    token: string;
    installments: number;
  };
  customer_email: string;
  acceptance_token: string;
  accept_personal_auth: string;
  amount_in_cents: number;
  currency: string;
  reference: string;
  signature: string;
}
