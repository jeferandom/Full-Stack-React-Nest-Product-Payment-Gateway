import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PaymentInfo, DeliveryInfo, OrderItem } from '../../types';
import { TextField, InputAdornment } from '@mui/material';
import { tokenize, CreditCardValidatorService } from "../../services/creditCardService";
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
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
    idType: string;
    idNumber: string;
    installments: number;
    address: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    paymentInfo,
    deliveryInfo,
}) => {
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, setError, clearErrors, watch, setValue } = useForm<Inputs>();
    const [cardType, setCardType] = useState<string | null>(null);
    const [isMaskedNumber, setIsMaskedNumber] = useState(false);
    const validator = new CreditCardValidatorService();

    const onSubmitHandler: SubmitHandler<Inputs> = async (data) => {
        if (!validator.validateCard(data.number)) {
            setError("number", { type: "manual", message: "Invalid card number" });
            return;
        }

        const tokenResult = await tokenize({
            number: data.number,
            cvc: data.cvc,
            exp_month: data.exp_month,
            exp_year: data.exp_year,
            card_holder: data.card_holder,
        });

        if (tokenResult.success) {
            localStorage.setItem("cardToken", JSON.stringify(tokenResult.data.tokenId));
            localStorage.setItem("lastFour", JSON.stringify(tokenResult.data.lastFour));
            //dispatch(onSubmit(data));
        } else {
            setError("number", { type: "manual", message: tokenResult.error.message });
        }
    }

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (isMaskedNumber) {
            // Reset the field when user starts typing on a masked number
            setValue('number', '');
            setIsMaskedNumber(false);
            return;
        }
        const value = event.target.value.replace(/\D/g, '');
        const type = validator.identifyCardType(value);
        setCardType(type);

        // Validate card while typing only when not masked
        if (!isMaskedNumber) {
            if (!validator.validateCard(value)) {
                setError("number", { type: "manual", message: "Invalid card number" });
            } else {
                clearErrors("number");
            }
        }
    };

    const getCardIcon = (cardNumber: string) => {
        if (!cardNumber) return null;

        switch (cardType) {
            case 'visa':
                return "<VisaIcon />";
            case 'mastercard':
                return "<MastercardIcon />";
            case 'amex':
                return "<AmexIcon />";
            default:
                return null;
        }
    };
    const saveFormState = () => {
        const currentState = watch();
        const { cvc, ...stateWithoutCVC } = currentState;  // Remove CVC before saving
        localStorage.setItem('paymentFormState', JSON.stringify(stateWithoutCVC));
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        saveFormState();
    }
    useEffect(() => {
        const savedFormState = localStorage.getItem('paymentFormState');
        const savedLastFour = localStorage.getItem('lastFour');

        if (savedFormState) {
            const parsedState = JSON.parse(savedFormState);
            Object.keys(parsedState).forEach((key) => {
                if (key !== 'cvc') {  // Skip setting CVC value
                    setValue(key as keyof Inputs, parsedState[key]);
                }
            });
        }

        if (savedLastFour) {
            const lastFour = JSON.parse(savedLastFour);
            setValue('number', `************${lastFour}`);
            setIsMaskedNumber(true);
        }
    }, [setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
                type="tel"
                fullWidth
                label="Número de la tarjeta"
                id="number"        
                helperText={errors.number ? errors.number.message : ''}        
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {getCardIcon(watch('number'))}
                        </InputAdornment>
                    ),
                }}
                {...register("number", {
                    required: true,
                    onChange: handleCardNumberChange,
                    onBlur: handleBlur,                    
                })}
            />
            {errors.number && <span>This field is required</span>}

            <TextField
                type="number"
                fullWidth
                label="Mes"
                id="exp_month"
                helperText={errors.exp_month ? errors.exp_month.message : ''}
                {...register("exp_month", {
                    required: true,
                    onBlur: handleBlur,
                })}
            />
            {errors.exp_month && <span>This field is required</span>}

            <TextField
                type="number"
                fullWidth
                label="Año"
                id="exp_year"
                helperText={errors.exp_year ? errors.exp_year.message : ''}
                InputProps={{ inputProps: { maxLength: 2 } }}
                {...register("exp_year", {
                    required: true,
                    maxLength: 2,
                    onBlur: handleBlur,
                })}
            />
            {errors.exp_year && <span>This field is required</span>}

            <TextField
                type="password"
                fullWidth
                label="CVC"
                id="cvc"
                helperText={errors.cvc ? errors.cvc.message : ''}
                InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*' } }}
                {...register("cvc", {
                    required: true,
                })}
            />
            {errors.cvc && <span>This field is required</span>}

            <TextField
                type="tel"
                fullWidth
                label="Nombre en la tarjeta"
                id="card_holder"
                helperText={errors.card_holder ? errors.card_holder.message : ''}
                {...register("card_holder", {
                    required: true,
                    onBlur: handleBlur,
                })}
            />
            {errors.card_holder && <span>This field is required</span>}

            <TextField
                select
                fullWidth
                label="Tipo de identificación"
                id="idType"
                helperText={errors.idType ? errors.idType.message : ''}
                SelectProps={{
                    native: true,
                }}
                {...register("idType", {
                    required: true,
                    onBlur: handleBlur,
                })}
            >
                <option value="cc">Cédula de ciudadanía</option>
                <option value="passport">Pasaporte</option>
            </TextField>
            {errors.idType && <span>This field is required</span>}

            <TextField
                type="text"
                fullWidth
                label="Ingresa el documento de identificación"
                id="idNumber"
                helperText={errors.idNumber ? errors.idNumber.message : ''}
                {...register("idNumber", {
                    required: true,
                    onBlur: handleBlur,
                })}
            />
            {errors.idNumber && <span>This field is required</span>}

            <TextField
                type="number"
                fullWidth
                label="Installments"
                id="installments"
                helperText={errors.installments ? errors.installments.message : ''}
                {...register("installments", {
                    required: true,
                    onBlur: handleBlur,
                })}
            />
            {errors.installments && <span>This field is required</span>}

            <TextField
                type="text"
                fullWidth
                label="Address"
                id="address"
                helperText={errors.address ? errors.address.message : ''}
                {...register("address", {
                    required: true,
                    onBlur: handleBlur,
                })}
            />
            {errors.address && <span>This field is required</span>}

            <button type="submit" value='Continuar' />
        </form>
    );
}

export default PaymentForm;
