import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Generator from '../pages/Generator.jsx';
import Editor from '../pages/Editor.jsx';
import ExportPage from '../pages/Export.jsx';
import Settings from '../pages/Settings.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
