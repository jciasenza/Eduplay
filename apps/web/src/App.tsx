import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { GameLobby } from './pages/GameLobby';
import { GamePlay } from './pages/GamePlay';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';
import { WorldLanding } from './pages/WorldLanding';
import { Subscribe } from './pages/Subscribe';
import { SubscriptionSuccess } from './pages/SubscriptionSuccess';
import { SubscriptionCancel } from './pages/SubscriptionCancel';
import { Account } from './pages/Account';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { About } from './pages/About';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        <Route path="/world/:worldId" element={<WorldLanding />} />
        <Route path="/world/:worldId/game/:gameId" element={<GameLobby />} />
        <Route path="/world/:worldId/game/:gameId/level/:levelId" element={<GamePlay />} />
        <Route path="/play/:levelId" element={<GamePlay />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
