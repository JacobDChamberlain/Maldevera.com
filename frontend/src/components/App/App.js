import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavBar from '../NavBar/NavBar';
import Header from '../Header/Header';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../Footer/Footer';
import SocialMediaBar from '../SocialMediaBar/SocialMediaBar';
import Home from '../Pages/Home/Home';
import Merch from '../Pages/Merch/Merch';
import About from '../Pages/About/About';
import Shows from '../Pages/Shows/Shows';
import Tours from '../Pages/Tours/Tours';
import Contact from '../Pages/Contact/Contact';
import Purchase from '../Pages/Purchase/Purchase';
import NotFound from '../Pages/NotFound/NotFound';
import FloatingCartButton from '../FloatingCartButton/FloatingCartButton';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './App.css';

import { ThemeProvider } from '../../context/ThemeContext';
import { MerchCartProvider } from '../../context/MerchCartContext';
import { InventoryProvider } from '../../context/InventoryContext';
import SuccessfulPurchase from '../Pages/Checkout/Success/CheckoutSuccess';
import FailedPurchase from '../Pages/Checkout/Cancel/CheckoutCancel';
import CurrentStock from '../Pages/CurrentStock/CurrentStock';
import Chat from '../Pages/Chat/Chat';
import FancyBorderPreview from '../Templates/FancyBorder';

function RainOverlay() {
  const { logoCycling } = useTheme();

  if (!logoCycling) return null;

  return (
    <video
      className="rain-overlay"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/videos/rain-overlay.mp4" type="video/mp4" />
    </video>
  );
}

function App() {
  return (
    <ThemeProvider>
    <RainOverlay />
    <div className="App">
      <ThemeToggle />

      <ul class="lightrope">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <InventoryProvider>
        <MerchCartProvider>
          <BrowserRouter>
            <NavBar />
            <Header />
            <SocialMediaBar />
              <Routes>
                <Route path='/' Component={ Home } />
                <Route path='/merch' Component={ Merch } />
                <Route path='/about' Component={ About } />
                <Route path='/shows' Component={ Shows } />
                <Route path='/tour' Component={ Tours } />
                <Route path='/tours' Component={ Tours } />
                <Route path='/contact' Component={ Contact } />
                <Route path='/checkout' Component={ Purchase } />
                <Route path='/successful-purchase' Component={ SuccessfulPurchase } />
                <Route path='/sad-yeet' Component={ FailedPurchase } />
                <Route path='/sup' Component={ Chat } />
                <Route path='/stock' Component={ CurrentStock } />
                <Route path='/preview/fancy-border' Component={ FancyBorderPreview } />
                <Route path='*' Component={ NotFound } />
              </Routes>
          </BrowserRouter>
          <FloatingCartButton />
        </MerchCartProvider>
      </InventoryProvider>
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default App;
