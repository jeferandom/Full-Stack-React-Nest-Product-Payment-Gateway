import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PaymentInfo, DeliveryInfo, OrderItem } from '../../types';
import { TextField, InputAdornment } from '@mui/material';
import { CreditCardValidatorService } from "../../services/creditCardService";
import { useNavigate } from 'react-router'; // Add this import
import { styled } from '@mui/material/styles';

import {
    setPaymentInfo,
    setDeliveryInfo
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

const FormContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem', 
    padding: '1rem',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&.Mui-error': {
            '& fieldset': {
                borderColor: theme.palette.error.main,
                borderWidth: '2px',
            },
        },
    },
    '& .MuiFormHelperText-root.Mui-error': {
        color: theme.palette.error.main,
        marginLeft: 0,
    },

    '&.Mui-error': {
        '& label': {
            color: theme.palette.error.main,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
        },
    }
}));

const PaymentForm: React.FC<PaymentFormProps> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const { register, handleSubmit, formState: { errors }, setError, clearErrors, watch, setValue } = useForm<Inputs>();
    const [cardType, setCardType] = useState<string | null>(null);
    const [originalNumber, setOriginalNumber] = useState<string>('');
    const validator = new CreditCardValidatorService();

    const onSubmitHandler: SubmitHandler<Inputs> = async (data) => {
        if (!validator.validateCard(originalNumber)) {
            setError("number", { type: "manual", message: "Invalid card number" });
            return;
        }
        dispatch(setPaymentInfo({
            number: originalNumber,
            cvc: data.cvc,
            exp_month: data.exp_month,
            exp_year: data.exp_year,
            card_holder: data.card_holder,
            id_type: data.idType,
            id_number: data.idNumber,
            installments: data.installments,
            customer_email: ''
        }));

        dispatch(setDeliveryInfo({
            address: data.address,
            city: 'Cali',
            country: 'Colombia'
        }));

        navigate('/order-summary');

    }

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value.replace(/\D/g, '');
        setOriginalNumber(value);
        const type = validator.identifyCardType(value);
        setCardType(type);

        const validated = validator.validateCard(value)
        if (!validated) {
                setError("number", { type: "manual", message: "Invalid card number" });
            } else {
                clearErrors("number");
        }
    };

    const handleCardNumberBlur = () => {
        if (originalNumber && originalNumber.length >= 4) {
            const lastFour = originalNumber.slice(-4);
            setValue('number', `************${lastFour}`);
        }
        handleBlur();
    };

    const handleCardNumberFocus = () => {
        if (originalNumber) {
            setValue('number', originalNumber);
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
        const { cvc, number, ...stateWithoutCVC } = currentState;
        // Remove CVC before saving
        localStorage.setItem('paymentFormState', JSON.stringify(stateWithoutCVC));
    };

    const handleBlur = () => {
        saveFormState();
    }
    useEffect(() => {
        const savedFormState = localStorage.getItem('paymentFormState');

        if (savedFormState) {
            const parsedState = JSON.parse(savedFormState);
            Object.keys(parsedState).forEach((key) => {
                setValue(key as keyof Inputs, parsedState[key]);
            });

            dispatch(setPaymentInfo({
                card_holder: parsedState.card_holder,
                exp_month: parsedState.exp_month,
                exp_year: parsedState.exp_year,
                id_type: parsedState.idType,
                id_number: parsedState.idNumber,
                installments: parsedState.installments,
                customer_email: 'jefmancera@test.com'
            }));
        }


    }, [setValue, dispatch]); // Add dispatch to dependency array

    const ContinueButton = () => {
        return (
            <button type="submit">
                Continuar
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <FormContainer>
                <StyledTextField
                    error={!!errors.number}
                    label="Número de la tarjeta"
                    id="number"
                    defaultValue=""
                    helperText={errors.number?.message || ''}
                    type="tel"
                    fullWidth
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
                        onBlur: handleCardNumberBlur,
                        onFocus: handleCardNumberFocus
                    })}
                />

                <StyledTextField
                    error={!!errors.exp_month}
                    label="Mes"
                    id="exp_month"
                    defaultValue=""
                    helperText={errors.exp_month?.message || ''}
                    type="number"
                    fullWidth
                    {...register("exp_month", {
                        required: true,
                        onBlur: handleBlur,
                    })}
                />
                {errors.exp_month && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.exp_year}
                    label="Año"
                    id="exp_year"
                    defaultValue=""
                    helperText={errors.exp_year?.message || ''}
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { maxLength: 2 } }}
                    {...register("exp_year", {
                        required: true,
                        maxLength: 2,
                        onBlur: handleBlur,
                    })}
                />
                {errors.exp_year && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.cvc}
                    label="CVC"
                    id="cvc"
                    defaultValue=""
                    helperText={errors.cvc?.message || ''}
                    type="password"
                    fullWidth
                    InputProps={{ inputProps: { inputMode: 'numeric', pattern: '[0-9]*' } }}
                    {...register("cvc", {
                        required: true,
                    })}
                />
                {errors.cvc && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.card_holder}
                    label="Nombre en la tarjeta"
                    id="card_holder"
                    defaultValue=""
                    helperText={errors.card_holder?.message || ''}
                    type="tel"
                    fullWidth
                    {...register("card_holder", {
                        required: true,
                        onBlur: handleBlur,
                    })}
                />
                {errors.card_holder && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.idType}
                    label="Tipo de identificación"
                    id="idType"
                    defaultValue=""
                    helperText={errors.idType?.message || ''}
                    select
                    fullWidth
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
                </StyledTextField>
                {errors.idType && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.idNumber}
                    label="Ingresa el documento de identificación"
                    id="idNumber"
                    defaultValue=""
                    helperText={errors.idNumber?.message || ''}
                    type="text"
                    fullWidth
                    {...register("idNumber", {
                        required: true,
                        onBlur: handleBlur,
                    })}
                />
                {errors.idNumber && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.installments}
                    label="Installments"
                    id="installments"
                    defaultValue=""
                    helperText={errors.installments?.message || ''}
                    type="number"
                    fullWidth
                    {...register("installments", {
                        required: true,
                        onBlur: handleBlur,
                    })}
                />
                {errors.installments && <span>This field is required</span>}

                <StyledTextField
                    error={!!errors.address}
                    label="Address"
                    id="address"
                    defaultValue=""
                    helperText={errors.address?.message || ''}
                    type="text"
                    fullWidth
                    {...register("address", {
                        required: true,
                        onBlur: handleBlur,
                    })}
                />
                {errors.address && <span>This field is required</span>}

                <ContinueButton />
            </FormContainer>
        </form>
    );
}

export default PaymentForm;
