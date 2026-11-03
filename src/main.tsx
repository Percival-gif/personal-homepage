import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import App from './App';
import { ComicCursor } from './components/ComicCursor';
import './styles/global.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><App/><ComicCursor/></HashRouter></React.StrictMode>);
