import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/_base.scss';
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from './sections/Home';

const router = createHashRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
