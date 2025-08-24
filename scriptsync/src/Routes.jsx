import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ScriptEditorPage from './pages/script-editor';
import ScriptCreationModal from './pages/script-creation-modal';
import LandingPage from './pages/landing-page';
import MonitorDashboard from './pages/monitor-dashboard';
import WriterDashboard from './pages/writer-dashboard';
import AuthenticationModal from './pages/authentication-modal';
import InviteCollaboratorsModal from './pages/invite-collaborators-modal';
import ProfileSettingsPage from './pages/profile-settings-page';
import ProfilePage from './pages/profile-page';
import SettingsPage from './pages/settings-page';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/script-editor" element={<ScriptEditorPage />} />
        <Route path="/script-editor/:scriptId" element={<ScriptEditorPage />} />
        <Route path="/script-creation" element={<ScriptCreationModal />} />
        <Route path="/script-creation-modal" element={<ScriptCreationModal />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/monitor-dashboard" element={<MonitorDashboard />} />
        <Route path="/writer-dashboard" element={<WriterDashboard />} />
        <Route path="/invite-collaborators-modal" element={<InviteCollaboratorsModal />} />
        <Route path="/profile-settings-page" element={<ProfileSettingsPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/settings-page" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;