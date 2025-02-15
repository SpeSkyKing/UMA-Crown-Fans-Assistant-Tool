import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Home } from './components/home';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
      <StrictMode>
            <Home />
      </StrictMode>
);
