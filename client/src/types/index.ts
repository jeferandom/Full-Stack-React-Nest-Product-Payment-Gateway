export interface PaymentInfo {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
  customer_email: string;
  id_type: string;
  id_number: string;
  installments: number;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  country: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
}
