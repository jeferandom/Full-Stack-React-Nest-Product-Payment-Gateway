import React from 'react';



const OrderSummary: React.FC = () => {
    // const tokenResult = await tokenize({
    //             number: data.number,
    //             cvc: data.cvc,
    //             exp_month: data.exp_month,
    //             exp_year: data.exp_year,
    //             card_holder: data.card_holder,
    //         });


    // localStorage.setItem("cardToken", JSON.stringify(tokenResult.data.tokenId));
    // localStorage.setItem("lastFour", JSON.stringify(tokenResult.data.lastFour));
    return (
        <>
            <h2>Información de envío</h2>
            <h2>Información de pago</h2>
            <h2>Total</h2>
        </>
    );

}

export default OrderSummary;