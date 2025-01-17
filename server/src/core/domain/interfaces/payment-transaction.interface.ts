export interface ResponseTransactionPaymentGateway {
  data: {
    id: string;
    created_at: string;
    finalized_at: string;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method_type: string;
    payment_method: {
      type: string;
      extra: {
        bin: string;
        name: string;
        brand: string;
        exp_year: string;
        card_type: string;
        exp_month: string;
        last_four: string;
        card_holder: string;
        is_three_ds: boolean;
        three_ds_auth_type: string;
      };
      installments: number;
    };
    status: string;
    status_message: string;
    billing_data: string;
    shipping_address: string;
    redirect_url: string;
    payment_source_id: string;
    payment_link_id: string;
    customer_data: string;
    bill_id: string;
    taxes: [];
    tip_in_cents: string;
  };
  meta: any;
}

export interface ErrorResponseTransactionPaymentGateway {
  error: {
    type: string;
    messages: {
      [key: string]: string[];
    };
  };
}
