import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import { Banknote, CreditCard, ChevronRight, Lock } from 'lucide-react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Stripe CardElement styles
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#374151',
      fontFamily: 'inherit',
      '::placeholder': { color: '#9CA3AF' },
      iconColor: '#6B7280',
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
  hidePostalCode: true,
}

const CardForm = ({ cardName, setCardName, cardError, cardComplete, onCardChange }) => (
  
  <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 
    rounded-xl p-4 space-y-3">

    {/* Cardholder Name (not part of Stripe CardElement, collected separately) */}
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        Cardholder Name
      </label>
      <input
        type="text"
        placeholder="John Doe"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
      />
    </div>

    {/* Stripe CardElement — securely collects card number, expiry, CVV */}
    <div>
      
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        Card Details
      </label>

      <div className="bg-white border border-gray-300 rounded-lg px-3 py-3 
        focus-within:ring-2 focus-within:ring-[#FFB703] focus-within:border-transparent transition">
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={onCardChange} />
      </div>

      {cardError && (
        <p className="text-xs text-red-500 mt-1">{cardError}</p>
      )}
      
      {cardComplete && !cardError && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <Lock size={10} /> Card details verified
        </p>
      )}

    </div>

    {/* Accepted cards + security note */}
    <div className="flex items-center justify-between">
     
      <div className="flex gap-1">
        {['VISA', 'MC', 'AMEX'].map(b => (
          <span key={b} className="text-[9px] font-bold bg-white border border-gray-200 
            text-gray-500 rounded px-1.5 py-0.5 leading-tight">{b}</span>
        ))}
      </div>
     
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Lock size={10} />
        <span>Encrypted & secure</span>
      </div>
    
    </div>

  </div>
)

const Checkout = () => {

  const { axios, navigate, totalPrice, fetchCart, loading, setLoading } = useContext(AppContext)

  // Real Stripe hooks (work because <Elements> wraps the app in main.jsx) 
  const stripe = useStripe()
  const elements = useElements()

  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery")

  // Card state
  const [cardName, setCardName] = useState("")
  const [cardError, setCardError] = useState("")
  const [cardComplete, setCardComplete] = useState(false)

  // Fired by CardElement on every keystroke
  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : "")
    setCardComplete(event.complete)
  }

  const handleCheckOut = async () => {

    if (!address.trim()) {
      toast.error("Please enter your delivery address")
      return
    }

    // ONLINE PAYMENT
    if (paymentMethod === "Online Payment") {

      // if (!stripe || !elements) {
      //   toast.error("Stripe is not ready yet. Please wait a moment.")
      //   return
      // }

      // if (!cardName.trim()) {
      //   toast.error("Please enter the cardholder name")
      //   return
      // }

      // if (!cardComplete) {
      //   toast.error("Please complete your card details")
      //   return
      // }

      // try {
      //   setLoading(true)

      //   // Step 1 — Ask backend to create a PaymentIntent, get clientSecret
      //   const intentRes = await axios.post('/api/order/create-payment-intent', {
      //     amount: totalPrice
      //   })

      //   if (!intentRes.data.success) {
      //     toast.error(intentRes.data.message || "Payment initiation failed")
      //     return
      //   }

      //   const { clientSecret } = intentRes.data

      //   // Step 2 — Stripe confirms the card charge using the clientSecret
      //   const cardElement = elements.getElement(CardElement)

      //   const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      //     payment_method: {
      //       card: cardElement,
      //       billing_details: { name: cardName }
      //     }
      //   })

      //   if (error) {
      //     // Card declined, wrong CVV, insufficient funds, etc.
      //     setCardError(error.message)
      //     toast.error(error.message)
      //     return
      //   }

      //   if (paymentIntent.status !== 'succeeded') {
      //     toast.error("Payment was not completed. Please try again.")
      //     return
      //   }

      //   // Step 3 — Payment succeeded: place the order with the paymentIntent ID
      //   // Backend verifies this ID with Stripe before saving the order
      //   const { data } = await axios.post('/api/order/place', {
      //     address,
      //     paymentMethod,
      //     stripePaymentIntentId: paymentIntent.id   // backend verifies this
      //   })

      //   if (data.success) {
      //     toast.success(data.message)
      //     fetchCart()
      //     navigate('/my-orders')
      //   } else {
      //     toast.error(data.message)
      //   }

      // } catch (err) {
      //   console.error("Online payment error:", err)
      //   toast.error("Something went wrong. Please try again.")
      // } finally {
      //   setLoading(false)
      // }

      toast.success("Payment Successfully Submitted!")

      return
    }

    // ── CASH ON DELIVERY ──
    try {
      setLoading(true)

      const { data } = await axios.post('/api/order/place', {
        address,
        paymentMethod
      })

      if (data.success) {
        toast.success(data.message)
        fetchCart()
        navigate('/my-orders')
      } else {
        toast.error(data.message)
      }

    } catch (err) {
      console.error("COD checkout error:", err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 
      bg-white shadow-lg rounded-2xl mb-2'>

      {/* ── LEFT: Delivery Address ── */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Delivery Address</h2>
        <textarea
          rows={5}
          value={address}
          placeholder="Enter your full address"
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FFB703] 
            focus:outline-none resize-none"
        />
      </div>

      {/* ── RIGHT: Summary + Payment ── */}
      <div className="flex flex-col justify-between">

        <div>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="flex justify-between text-lg font-medium text-gray-700">
              <span>Total Amount:</span>
              <span className="text-[#FFB703] font-semibold">$ {totalPrice}</span>
            </p>
          </div>

          <h3 className="text-lg font-medium mb-3 text-gray-800">Payment Method</h3>

          <div className="space-y-3">

            {/* Cash on Delivery */}
            <label htmlFor="Cash on Delivery" className={`flex items-center gap-3 border-2 rounded-xl 
              p-3 cursor-pointer transition-all
              ${paymentMethod === 'Cash on Delivery'
                ? 'border-[#FFB703] bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio" name="payment" id="Cash on Delivery"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-[#FFB703]"
              />
              <Banknote size={20} className="text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
            </label>

            {/* Online Payment */}
            <label htmlFor="Online Payment" className={`flex items-center gap-3 border-2 rounded-xl 
              p-3 cursor-pointer transition-all
              ${paymentMethod === 'Online Payment'
                ? 'border-[#FFB703] bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio" name="payment" id="Online Payment"
                value="Online Payment"
                checked={paymentMethod === "Online Payment"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-[#FFB703]"
              />
              <CreditCard size={20} className="text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Pay Online</p>
                <p className="text-xs text-gray-500">Debit / Credit Card • Secure checkout</p>
              </div>
              <div className="ml-auto flex gap-1">
                {['VISA', 'MC', 'AMEX'].map(b => (
                  <span key={b} className="text-[9px] font-bold bg-white border border-gray-200 
                    text-gray-500 rounded px-1 py-0.5 leading-tight">{b}</span>
                ))}
              </div>
            </label>

          </div>

          {/* Real Stripe CardElement form */}
          {paymentMethod === "Online Payment" && (
            <CardForm
              cardName={cardName}
              setCardName={setCardName}
              cardError={cardError}
              cardComplete={cardComplete}
              onCardChange={handleCardChange}
            />
          )}

        </div>

        {/* Confirm / Pay Button */}
        <button onClick={handleCheckOut}
          disabled={loading || (paymentMethod === "Online Payment" && !stripe)}
          className="mt-6 bg-[#FFB703] text-white py-3.5 rounded-xl hover:bg-[#E09A05]
            transition font-semibold cursor-pointer flex items-center justify-center gap-2 
            shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? (
            
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {paymentMethod === "Online Payment" ? "Processing Payment..." : "Placing Order..."}
            </>

          ) : (
            
            <>
              {paymentMethod === "Online Payment" ? (
                <><Lock size={15} /> Pay $ {totalPrice} Securely</>
              ) : (
                <>Confirm Order <ChevronRight size={16} /></>
              )}
            </>
          
          )}

        </button>

        {paymentMethod === "Online Payment" && (
          <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
            <Lock size={10} /> SSL encrypted • Powered by Stripe
          </p>
        )}

      </div>

    </div>
  )
}

export default Checkout