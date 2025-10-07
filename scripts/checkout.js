import { renderOrderSummary } from "./checkout/OrderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";

//for an import that runs the code inside a file like an oop file, we use an import syntax that runs all the code without importing anything like this line below:
//import '../data/cart-class.js'

//import '../data/backend-practice.js'
import { loadProducts } from '../data/products.js';

loadProducts(() => {
  renderOrderSummary();
  renderPaymentSummary();
});

