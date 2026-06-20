// components/Layout.jsx
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, hideHeader, hideFooter }) {
  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}