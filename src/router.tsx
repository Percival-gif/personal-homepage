import { lazy } from 'react';
export const routes = [
  { path: '/', title: '起始页', Component: lazy(() => import('./pages/Landing')) },
  { path: '/corridor', title: '涂鸦走廊', Component: lazy(() => import('./pages/Corridor')) },
  { path: '/about', title: '我是谁', Component: lazy(() => import('./pages/About')) },
  { path: '/work', title: '我做过什么', Component: lazy(() => import('./pages/Work')) },
  { path: '/now', title: '我现在在做什么', Component: lazy(() => import('./pages/Now')) },
  { path: '/projects', title: '创作展厅', Component: lazy(() => import('./pages/Projects')) },
  { path: '/projects/:slug', title: '创作展厅', Component: lazy(() => import('./pages/Projects')) },
  { path: '/notes', title: '公开随笔', Component: lazy(() => import('./pages/Notes')) },
  { path: '/notes/:slug', title: '公开随笔', Component: lazy(() => import('./pages/Notes')) },
  { path: '/diary', title: '私人笔记本', Component: lazy(() => import('./pages/Diary')) }
];
