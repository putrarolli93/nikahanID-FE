// components/Layout.jsx
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, currentPage, setPage, hideFooter = false }) {
  return (
    <>
      <Header currentPage={currentPage} setPage={setPage} />
      <main>{children}</main>
      {!hideFooter && <Footer setPage={setPage} />}
    </>
  );
}