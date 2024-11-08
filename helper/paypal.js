import * as paypal from "@paypal/checkout-server-sdk"; // Используй именно * as для импорта

// Конфигурация PayPal SDK
function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

// Создание клиента для работы с PayPal API
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export default client;
