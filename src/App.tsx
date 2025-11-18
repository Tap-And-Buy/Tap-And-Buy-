import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/common/RequireAuth';
import { BottomNav } from './components/common/BottomNav';
import routes from './routes';

function AppContent() {
  const location = useLocation();
  const hideBottomNav = ['/welcome', '/login', '/register', '/email-confirmation', '/admin/login', '/payment'].some(path =>
    location.pathname.startsWith(path) || location.pathname.includes('/admin/')
  );

  return (
    <>
      <Toaster position="top-center" richColors />
      <RequireAuth whiteList={['/welcome', '/login', '/register', '/email-confirmation', '/admin/login', '/admin/*']}>
        <div className="flex flex-col min-h-screen">
          <main className={hideBottomNav ? 'flex-grow' : 'flex-grow pb-16'}>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </main>
          {!hideBottomNav && <BottomNav />}
        </div>
      </RequireAuth>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
