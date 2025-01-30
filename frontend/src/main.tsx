import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./main.css"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Details from './views/Details.tsx'
import Registro from './views/Registro.tsx'
import Login from './views/Login.tsx'

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
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
