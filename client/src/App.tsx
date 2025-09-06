import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./components/layout/AppLayout"
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import './App.css'
import { RegisterForm } from "./pages/RegisterForm";
import { LoginForm } from "./pages/LoginForm";
import { AuthProvider } from "./context/AuthContext";
import { Learn } from "./pages/Learn";
import { Notes } from "./pages/Notes";
import { Questions } from "./pages/Questions";
import { Tests } from "./pages/Tests";

export const App = () => {

  const router = createBrowserRouter([{
    path:'/',
    element:<AppLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/about',
        element:<About/>
      },
      {
        path:'/contact',
        element:<Contact/>
      },
      {
        path:'/register',
        element:<RegisterForm/>
      },
      {
        path:'/login',
        element:<LoginForm/>
      },
      {
        path:'/learn',
        element:<Learn/>
      },
      {
        path:'/notes',
        element:<Notes/>
      },
      {
        path:'/questions',
        element:<Questions/>
      },
      {
        path:'/tests',
        element:<Tests/>
      },
    ]
  }])
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}
