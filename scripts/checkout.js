import { renderOrderSummary } from "./checkout/OrderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFecth } from '../data/products.js';
import { loadCart } from "../data/cart.js";

//for an import that runs the code inside a file like an oop file, we use an import syntax that runs all the code without importing anything like this line below:
//import '../data/cart-class.js'

//import '../data/backend-practice.js'

async function loadPage() {
  try {
    //throw 'error1';

    await loadProductsFecth();

    const value = await new Promise((resolve, reject) => {
      //throw "error2";
      loadCart(() => {
        //reject('error3')
        resolve('value3');
      });
    })

  } catch (error) {
    console.error('unexpected error, please try again later');
  }


  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

/*

Promise.all([
  loadProductsFecth(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })

]).then((values) => {
  console.log(values);
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve('value1');
  });

}).then((value) => {
  console.log(value);
  return new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });

}).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
});
*/