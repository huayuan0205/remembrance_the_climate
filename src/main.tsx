import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import './styles/_base.scss';
import Home from './sections/Home';
import citiesDirectory from "./data/citiesDirectory.ts";
import ModalNav from "./components/ModalNav.tsx";


const router = createHashRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <ModalNav cities={citiesDirectory} />
      <RouterProvider router={router} />
  </React.StrictMode>,
)
