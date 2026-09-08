import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { SplashPage } from './pages/SplashPage';
import { HomePage } from './pages/HomePage';
import { ItemsListPage } from './pages/items/ItemsListPage';
import { AddEditItemPage } from './pages/items/AddEditItemPage';
import { PartiesListPage } from './pages/parties/PartiesListPage';
import { AddEditPartyPage } from './pages/parties/AddEditPartyPage';
import { CompaniesListPage } from './pages/companies/CompaniesListPage';
import { AddEditCompanyPage } from './pages/companies/AddEditCompanyPage';
import { SaudaListPage } from './pages/sauda/SaudaListPage';
import { CreateSaudaPage } from './pages/sauda/CreateSaudaPage';
import { EditSaudaPage } from './pages/sauda/EditSaudaPage';
import { SaudaBillsPage } from './pages/sauda/SaudaBillsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ReportsPage } from './pages/profile/ReportsPage';
import { QuickValuesPage } from './pages/profile/QuickValuesPage';
import { PinSecurityPage } from './pages/profile/PinSecurityPage';
import { ReferralsPage } from './pages/profile/ReferralsPage';
import { LegalPages } from './pages/legal/LegalPages';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppProvider>
            <ToastProvider>
            <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<SplashPage />} />
              <Route path="/splash" element={<SplashPage />} />
              <Route path="/home" element={<HomePage />} />

              {/* Items */}
              <Route path="/items" element={<ItemsListPage />} />
              <Route path="/items/new" element={<AddEditItemPage />} />
              <Route path="/items/edit/:id" element={<AddEditItemPage />} />

              {/* Parties */}
              <Route path="/parties" element={<PartiesListPage />} />
              <Route path="/parties/new" element={<AddEditPartyPage />} />
              <Route path="/parties/edit/:id" element={<AddEditPartyPage />} />

              {/* Companies */}
              <Route path="/companies" element={<CompaniesListPage />} />
              <Route path="/companies/new" element={<AddEditCompanyPage />} />
              <Route path="/companies/edit/:id" element={<AddEditCompanyPage />} />

              {/* Sauda Orders */}
              <Route path="/sauda" element={<SaudaListPage />} />
              <Route path="/sauda/create" element={<CreateSaudaPage />} />
              <Route path="/sauda/edit/:id" element={<EditSaudaPage />} />
              <Route path="/sauda/dispatch" element={<Navigate to="/sauda" replace />} />
              <Route path="/sauda/bills" element={<SaudaBillsPage />} />

              {/* Profile & Utilities */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/reports" element={<ReportsPage />} />
              <Route path="/profile/quick-values" element={<QuickValuesPage />} />
              <Route path="/profile/security" element={<PinSecurityPage />} />
              <Route path="/profile/referrals" element={<ReferralsPage />} />

              {/* Legal & Support */}
              <Route path="/legal/terms" element={<LegalPages />} />
              <Route path="/legal/privacy" element={<LegalPages />} />
              <Route path="/legal/how-to-use" element={<LegalPages />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
          </ToastProvider>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}

export default App;
