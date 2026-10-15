import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Builds } from './pages/Builds';
import { Gear } from './pages/Gear';
import { Home } from './pages/Home';
import { Progression } from './pages/Progression';
import { Questionnaire } from './pages/Questionnaire';
import { Share } from './pages/Share';
import { Sheet } from './pages/Sheet';
import { Spells } from './pages/Spells';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="origin" element={<Questionnaire />} />
          <Route path="character" element={<Sheet />} />
          <Route path="progression" element={<Progression />} />
          <Route path="spells" element={<Spells />} />
          <Route path="gear" element={<Gear />} />
          <Route path="builds" element={<Builds />} />
          <Route path="share/:data" element={<Share />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
