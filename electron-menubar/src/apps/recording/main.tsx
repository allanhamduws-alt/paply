import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecordingWidget } from './RecordingWidget';
import '../../globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecordingWidget />
  </React.StrictMode>
);

