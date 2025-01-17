export class Order {
  constructor(
    public id: string,
    public items: { id: string; quantity: number }[],
    public customerId: string,
    public status: string,
    public customer_email: string,
    public deliveryInfo: { address: string; city: string; country: string },
    public createdAt: Date,
    public cardToken: string,
    public lastFourDigits: string,
    public total: number,
    public transaction?: {
      id: string;
      created_at: string;
      amount_in_cents: number;
      reference: string;
      customer_email: string;
      currency: string;
      status: string;
      status_message: string;
      redirect_url: string;
    },
  ) {}
}
