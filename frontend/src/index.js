import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import ReactModal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';

// A greeting for anyone who opens the console.
console.log(
  `%cYou crawled into the source. Bold.
There is nothing down here but Jeff. He greets you with forbidden knowledge:
From Man to Mist was only the beginning. Invoker will be unleashed Autumn 2026.
Invoke the corners of your wallet.

▲△▲   M A L D E V E R A   ▲△▲`,
  'color:#c1362f;font-size:13px;line-height:1.6;font-weight:bold;'
);

ReactModal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
