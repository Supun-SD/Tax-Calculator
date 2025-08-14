import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { Theme } from '@radix-ui/themes';

const root = createRoot(document.getElementById('root'));
root.render(
  <Theme hasBackground={false}>
    <App />
  </Theme>
);
