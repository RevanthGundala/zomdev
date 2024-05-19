import React, { useEffect } from "react";

const CashAppPay = () => {
  //   useEffect(() => {
  //     const script = document.createElement("script");
  //     script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
  //     script.async = true;

  //     script.onload = async () => {
  //       const appId = "{APPLICATION_ID}";
  //       const locationId = "{LOCATION_ID}";

  //       function buildPaymentRequest(payments) {
  //         const paymentRequest = payments.paymentRequest({
  //           countryCode: "US",
  //           currencyCode: "USD",
  //           total: {
  //             amount: "1.00",
  //             label: "Total",
  //           },
  //         });
  //         return paymentRequest;
  //       }

  //       async function initializeCashApp(payments) {
  //         const paymentRequest = buildPaymentRequest(payments);
  //         const cashAppPay = await payments.cashAppPay(paymentRequest, {
  //           redirectURL: window.location.href,
  //           referenceId: "my-website-00000001",
  //         });
  //         const buttonOptions = {
  //           shape: "semiround",
  //           width: "full",
  //         };
  //         await cashAppPay.attach("#cash-app-pay", buttonOptions);
  //         return cashAppPay;
  //       }

  //       async function createPayment(token) {
  //         const body = JSON.stringify({
  //           locationId,
  //           sourceId: token,
  //           idempotencyKey: window.crypto.randomUUID(),
  //         });

  //         const paymentResponse = await fetch("/payment", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body,
  //         });

  //         if (paymentResponse.ok) {
  //           return paymentResponse.json();
  //         }

  //         const errorBody = await paymentResponse.text();
  //         throw new Error(errorBody);
  //       }

  //       function displayPaymentResults(status) {
  //         const statusContainer = document.getElementById(
  //           "payment-status-container"
  //         );
  //         if (status === "SUCCESS") {
  //           statusContainer.classList.remove("is-failure");
  //           statusContainer.classList.add("is-success");
  //         } else {
  //           statusContainer.classList.remove("is-success");
  //           statusContainer.classList.add("is-failure");
  //         }

  //         statusContainer.style.visibility = "visible";
  //       }

  //       if (!window.Square) {
  //         throw new Error("Square.js failed to load properly");
  //       }

  //       let payments;
  //       try {
  //         payments = window.Square.payments(appId, locationId);
  //       } catch {
  //         const statusContainer = document.getElementById(
  //           "payment-status-container"
  //         );
  //         statusContainer.className = "missing-credentials";
  //         statusContainer.style.visibility = "visible";
  //         return;
  //       }

  //       let cashAppPay;
  //       try {
  //         cashAppPay = await initializeCashApp(payments);
  //       } catch (e) {
  //         console.error("Initializing Cash App Pay failed", e);
  //       }
  //       if (cashAppPay) {
  //         cashAppPay.addEventListener("ontokenization", async ({ detail }) => {
  //           const tokenResult = detail.tokenResult;
  //           if (tokenResult.status === "OK") {
  //             try {
  //               const paymentResults = await createPayment(tokenResult.token);
  //               displayPaymentResults("SUCCESS");
  //               console.debug("Payment Success", paymentResults);
  //             } catch (error) {
  //               displayPaymentResults("FAILURE");
  //               console.error("Payment failed", error);
  //             }
  //           } else {
  //             let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;

  //             if (tokenResult.errors) {
  //               errorMessage += ` and errors: ${JSON.stringify(
  //                 tokenResult.errors
  //               )}`;
  //             }
  //             displayPaymentResults("FAILURE");
  //             throw new Error(errorMessage);
  //           }
  //         });
  //       }
  //     };

  //     document.body.appendChild(script);

  //     return () => {
  //       document.body.removeChild(script);
  //     };
  //   }, []);

  return (
    <div>
      <form id="payment-form">
        <h2>Pay $1.00</h2>
        <div id="cash-app-pay"></div>
      </form>
      <div id="payment-status-container"></div>
    </div>
  );
};

export default CashAppPay;
