import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
export interface DeliveryInfo {
    address: string;
    city: string;
    country: string;
}

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

interface PaymentFormProps {
    paymentInfo: PaymentInfo;
    deliveryInfo: DeliveryInfo;
    orderItems?: OrderItem[] | undefined;
}

export interface OrderItem {
    id: string;
    quantity: number;
}


type Inputs = {
    number: string;
    card_holder: string;
    installments: number;
    address: string;
    city: string;
    country: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    paymentInfo,
    deliveryInfo,
    orderItems,
}) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    console.log(watch("number"));
    console.log('orderItems', orderItems)
    // watch input value by passing the name of it

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue={paymentInfo.number} {...register("number", { required: true })} />
            {errors.number && <span>This field is required</span>}

            <input defaultValue={paymentInfo.card_holder} {...register("card_holder", { required: true })} />
            {errors.card_holder && <span>This field is required</span>}

            <input defaultValue={paymentInfo.installments} type="number" {...register("installments", { required: true })} />
            {errors.installments && <span>This field is required</span>}

            <input defaultValue={deliveryInfo.address} {...register("address", { required: true })} />
            {errors.address && <span>This field is required</span>}

            <input defaultValue={deliveryInfo.city} {...register("city", { required: true })} />
            {errors.city && <span>This field is required</span>}

            <input defaultValue={deliveryInfo.country} {...register("country", { required: true })} />
            {errors.country && <span>This field is required</span>}

            <button type="button" value='Continuar' />
        </form>
    );
}

export default PaymentForm;
