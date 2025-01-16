import React, { useState } from 'react';
import { useForm, SubmitHandler, } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PaymentInfo, DeliveryInfo, OrderItem } from '../../types';
import { TextField, InputAdornment, Input } from '@mui/material';
import {
    AccessAlarmSharp as VisaIcon,
    AcUnitSharp as MastercardIcon,
    Abc as AmexIcon
} from '@mui/icons-material';

import {
    onSubmit,
    setPaymentInfo,
} from "../../reducers/paymentFormSlice";
interface PaymentFormProps {
    paymentInfo: PaymentInfo;
    deliveryInfo: DeliveryInfo;
    orderItems?: OrderItem[] | undefined;
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
}) => {
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<Inputs>();
    const [cardType, setCardType] = useState<string | null>(null);

    const onSubmitHandler: SubmitHandler<Inputs> = (data) => {
        dispatch(onSubmit(data));
    }

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(value)) {
            setCardType('visa');
        } else if (/^5[1-5][0-9]{14}$/.test(value)) {
            setCardType('mastercard');
        } else if (/^3[47][0-9]{13}$/.test(value)) {
            setCardType('amex');
        } else {
            setCardType(null);
        }
    };

    const getCardIcon = () => {
        switch (cardType) {
            case 'visa':
                return <VisaIcon />;
            case 'mastercard':
                return <MastercardIcon />;
            case 'amex':
                return <AmexIcon />;
            default:
                return null;
        }
    };

    const validateCardNumber = (number: string) => {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/;
        return regex.test(number);
    };

    const handleCardBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const isValid = validateCardNumber(value);
        if (!isValid) {
            setError(name as keyof Inputs, { type: 'manual', message: 'Invalid card number format' });
        } else {
            clearErrors(name as keyof Inputs);
            dispatch(setPaymentInfo({ "number": value }));
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
                type="tel"
                fullWidth
                label="Credit card number"
                id="time"        
                helperText={errors.number ? errors.number.message : ''}        
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {getCardIcon()}
                        </InputAdornment>
                    ),
                }}
                {...register("number", {
                    required: true,
                    onChange: handleCardNumberChange,
                    onBlur: handleCardBlur
                })}
            />
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

            <button type="submit" value='Continuar' />
        </form>
    );
}

export default PaymentForm;
