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

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
