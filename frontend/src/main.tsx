import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./main.css"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Details from './views/Details.tsx'
import Registro from './views/Registro.tsx'
import Login from './views/Login.tsx'
import { Toaster } from 'react-hot-toast'
import PanelDeControl from './views/PanelDeControl.tsx'
import RecuperarContrasena from './views/RecuperarContrasena.tsx'
import PublicarAnuncio from './views/PublicarAnuncio.tsx'
import AnuncioDetalle from './views/AnuncioDetalle.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/detalle/:id",
    element: <Details/>
  },
  {
    path: "/registro",
    element: <Registro/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/recuperarContraseña",
    element: <RecuperarContrasena/>
  },
  {
    path: "/panelDeControl",
    element: <PanelDeControl/>
  },
  {
    path: "/publicar-anuncio",
    element: <PublicarAnuncio/>
  },
  {
    path: "/anuncio/:id",
    element:<AnuncioDetalle/>
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <Toaster position="bottom-center" toastOptions={{
        style: {
          textAlign: "center", // Centrar el texto
          background: "#333", // Fondo oscuro
          color: "#fff", // Texto blanco
        },
      }} />
  </StrictMode>,
)
