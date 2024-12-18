import { loadStripe } from '@stripe/stripe-js';


let stripePromise;

export default function getStripe() {
    // console.log("STRIPE API KEY: ", process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    if ( !stripePromise ) {
        stripePromise = loadStripe(process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }

    return stripePromise;
}