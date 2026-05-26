import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartModal from './CartModal';
import CookieConsent from './CookieConsent';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { cartModalOpen, addedProduct, closeCartModal } = useCart();

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartModal isOpen={cartModalOpen} onClose={closeCartModal} addedProduct={addedProduct} />
      <CookieConsent />
    </>
  );
}
