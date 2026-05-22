import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import { CustomCursor } from './components/CustomCursor';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WritingPage } from './pages/WritingPage';
import { PostPage } from './pages/PostPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

// Layout wrapper for public pages
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="grain-overlay">
    <Nav />
    <main>{children}</main>
    <Footer />
  </div>
);

// Admin uses its own layout (no Footer/Nav)
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export default function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/writing" element={<Layout><WritingPage /></Layout>} />
          <Route path="/writing/:slug" element={<Layout><PostPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />

          {/* Auth / CMS */}
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>} />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="font-display text-6xl text-ink/20 italic mb-4">404</p>
                <p className="font-body text-ink/40 mb-6">This page doesn't exist.</p>
                <a href="/" className="font-mono text-sm text-sienna hover-underline">← go home</a>
              </div>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </CMSProvider>
  );
}
