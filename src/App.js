/* global PaymentRequest */
import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 'Shiny Moonstone',
      tips: 0.2,
      shipping: 9999.99,
      amount: 2.99,
      response: null,
      success: false
    };
    this.handlePaymentAction = this.handlePaymentAction.bind(this);
  }

  handlePaymentAction() {
    if (window.PaymentRequest) {
      // Price calculation will be not handled from the payment api
      const tipAmount = (this.state.amount + this.state.shipping) * this.state.tips;
      const totalAmount = tipAmount + this.state.shipping + this.state.amount;

      // A couple of example payment networks
      const methodData = [{ 
        supportedMethods: ['visa', 'discover']
      }];
      // Purchase details
      const details = { 
        displayItems: [{
          label: `${this.state.item} (in a box with giftcard)`,
          amount: { currency: 'EUR', value: this.state.amount }
        }, {
          label: '20% tips and Shipping',
          amount: { currency: 'EUR', value:  (this.state.shipping + tipAmount).toFixed(2) }
        }],
        total: { 
          label: 'Grand total', 
          amount: { currency: 'EUR', value: totalAmount.toFixed(2) } 
        },
        shippingOptions: [{
            id: 'space-ship',
            label: 'Worldwide shipping directly from the moon!',
            amount: { currency: 'EUR', value: this.state.shipping.toFixed(2) },
            selected: true //optional
        }]
      };
      // Options
      const options = { requestShipping: true };
      const request = new PaymentRequest(methodData, details, options)

      request
        // Show a native Payment Request UI and handle the result
        .show()
        // Process the payment and let the ui respond to it
        .then(paymentResponse => {
          // Process paymentResponse here... 
          this.setState({ success: true, response: paymentResponse });
          setTimeout(() => paymentResponse.complete('success'), 1000);
        })
        .catch(function(error) {
          console.error(error);
        });

    } else {
      // Use your legacy checkout form...
      console.info('Use your legacy checkout form...');
    }
  }

  render() {
    let responseContent;

    if (this.state.success) {
      responseContent = JSON.stringify(this.state.response, undefined, 2);
    }


    return (
      <div className="App">
        <div className="App-header">
          <h2>Payment Request Api</h2>
        </div>
        {window.PaymentRequest 
          ? (<button className="button" onClick={this.handlePaymentAction}>Payme Now!</button>)
          : (<p className="App-intro">Payment Web Api  <code>PaymentRequest</code> is not supported in this browser</p>) 
        }
        <pre id="json">
          {responseContent}
        </pre>
      </div>
    );
  }
}

export default App;
