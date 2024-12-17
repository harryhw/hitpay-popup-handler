# HitPay Popup Handler Documentation

## Overview
The `HitPay` module provides an interface to integrate and manage a HitPay payment popup in your web application. It allows initializing, toggling (opening/closing), and handling events such as success, error, or closure.

## Installation
Ensure you have access to the `HitPay` helper module. Import it into your project as shown below:

```ts
import HitPay from "@/helpers/hitpay.ts";
```

## Usage
The HitPay module exposes methods to:
- Initialize the payment popup
- Toggle the popup's visibility
- Handle success, error, and close events

Here is a basic example:

### Example Implementation
```tsx
import HitPay from "@/helpers/hitpay.ts";
import { useState } from "react";

function MyComponent() {
  const [hitpay] = useState(() => HitPay());

  const pay = () => {
    hitpay.init(YOUR_HITPAY_PAYMENTLINK, {
      domain: YOUR_HITPAY_URL // e.g., sandbox.hit-pay.com or hit-pay.com
    });
    
    hitpay.toggle(
      {
        paymentRequest: "your payment request id",     
        amount: 300 // Payment amount
      },
      {
        onClose: () => {
          console.log("Payment popup closed");
        },
        onSuccess: () => {
          console.log("Payment successful");
        },
        onError: (error) => {
          console.error("Payment error:", error);
        }
      }
    );
  };

  return <button onClick={pay}>Pay with HitPay</button>;
}
```

### Closing the Popup
To manually close the popup, call the `close()` method:

```ts
hitpay.close();
```

## API Reference

### `HitPay.init(defaultUrl: string, initOptions?: InitOptions)`
Initializes the HitPay iframe and prepares it for use.

#### Parameters:
- **defaultUrl** *(string)*: The default payment URL.
- **initOptions** *(object)* *(optional)*:
  - `scheme` *(string)*: URL scheme (default: "https").
  - `domain` *(string)*: Domain for HitPay (default: "hit-pay.com").
  - `path` *(string)*: Custom path for iframe (optional).

#### Example:
```ts
hitpay.init("https://sandbox.hit-pay.com/payment", { domain: "sandbox.hit-pay.com" });
```

---

### `HitPay.toggle(checkoutOptions: Record<string, any>, callbacks?: Callbacks)`
Toggles the HitPay popup visibility. It opens the popup with the specified checkout options and allows handling events via callbacks.

#### Parameters:
- **checkoutOptions** *(Record<string, any>)*: Options related to the payment.
  - Example keys: `paymentRequest`, `amount`.
- **callbacks** *(object)* *(optional)*: Callback functions for popup events.
  - `onClose` *(function)*: Triggered when the popup is closed.
  - `onSuccess` *(function)*: Triggered when the payment succeeds.
  - `onError` *(function)*: Triggered when there is an error.

#### Example:
```ts
hitpay.toggle({
  paymentRequest: "abc123",
  amount: 200,
}, {
  onClose: () => console.log("Popup closed"),
  onSuccess: () => console.log("Payment successful"),
  onError: (err) => console.error("Error:", err)
});
```

---

### `HitPay.close()`
Closes the HitPay payment popup.

#### Example:
```ts
hitpay.close();
```

## Event Handling
The HitPay module listens for events via the `window.postMessage` API. The following event types are handled internally:
- **loaded**: Marks the iframe as ready.
- **toggle**: Toggles the popup visibility.
- **close**: Triggers the `onClose` callback.
- **success**: Triggers the `onSuccess` callback.
- **error**: Triggers the `onError` callback.

## Configuration
The module uses a configuration object internally with the following structure:

```ts
interface Config {
  visible: boolean; // Popup visibility state
  defaultUrl: string; // Default payment URL
  initOptions: InitOptions; // Initialization options
  callbacks: Callbacks; // Event callbacks
  checkoutOptions: Record<string, any>; // Checkout options
}
```

## Summary
The `HitPay` module simplifies integrating a payment popup into your web application. By providing easy methods for initialization, toggling visibility, and event handling, it enables a seamless user experience for handling payments securely.

### Notes:
- Ensure the HitPay domain (`sandbox.hit-pay.com` or `hit-pay.com`) is correctly configured.
- Use proper callbacks to handle success, error, or close events efficiently.

---

### Example Recap
Full example integrating the module:

```tsx
import HitPay from "@/helpers/hitpay.ts";
import { useState } from "react";

function MyComponent() {
  const [hitpay] = useState(() => HitPay());

  const pay = () => {
    hitpay.init("https://sandbox.hit-pay.com/payment/@123" /*Your payment link*/, {
      domain: "sandbox.hit-pay.com"
    });

    hitpay.toggle(
      {
        paymentRequest: "payment-id-12345",
        amount: 300
      },
      {
        onClose: () => console.log("Payment popup closed"),
        onSuccess: () => console.log("Payment successful"),
        onError: (error) => console.error("Payment error:", error)
      }
    );
  };

  return <button onClick={pay}>Pay Now</button>;
}

export default MyComponent;
```
My telegram: @hrnghkg

