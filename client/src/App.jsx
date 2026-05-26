import React, { Suspense, lazy } from 'react';

const AppRoutes = lazy(() => import('./routes/AppRoutes.jsx'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading…</div>}>
      <AppRoutes />
    </Suspense>
  );
}
