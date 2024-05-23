"use client";

import React from "react";
import { PaymentForm } from "react-square-web-payments-sdk";

type SquarePaymentFormProps = {
  children: React.ReactNode;
  cardTokenizeResponseReceived: (token: any, verifiedBuyer: any) => any;
  createPaymentRequest: () => any;
};

export default function SquarePaymentForm({
  children,
  cardTokenizeResponseReceived,
  createPaymentRequest,
}: SquarePaymentFormProps) {
  const props = {
    applicationId: process.env.NEXT_PUBLIC_SQUARE_APP_ID!,
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
    cardTokenizeResponseReceived,
    createPaymentRequest,
    // createVerificationDetails: () => ({
    //   // You can avoid amount and currency if the intent is `STORE`
    //   amount: '1.00',
    //   currencyCode: 'GBP',
    //   // `CHARGE` or `STORE`
    //   intent: 'CHARGE',
    //   billingContact: {
    //     addressLines: ['123 Main Street', 'Apartment 1'],
    //     familyName: 'Doe',
    //     givenName: 'John',
    //     email: 'jondoe@gmail.com',
    //     country: 'GB',
    //     phone: '3214563987',
    //     region: 'LND',
    //     city: 'London',
    //   },
    // }),
  };
  return <PaymentForm {...props}>{children}</PaymentForm>;
}
