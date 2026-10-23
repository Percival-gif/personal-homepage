import { lazy } from 'react';
export const routes = [
  { path: '/', title: '起始页', Component: lazy(() => import('./pages/Landing')) },
  { path: '/corridor', title: '涂鸦走廊', Component: lazy(() => import('./pages/Corridor')) },
  { path: '/about', title: '我是谁', Component: lazy(() => import('./pages/About')) },
  { path: '/work', title: '我做过什么', Component: lazy(() => import('./pages/Work')) },
  { path: '/now', title: '我现在在做什么', Component: lazy(() => import('./pages/Now')) },
  { path: '/diary', title: '我今天想说什么', Component: lazy(() => import('./pages/Diary')) }
];
