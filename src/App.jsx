import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { useState } from 'react';

import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Login from './pages/Login';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Profile', path: '/profile' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <div className="app">
      <Header 
        title="My Product Management App"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="main-layout">
        <Sidebar menuItems={menuItems} isOpen={isSidebarOpen} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, 
      { path: "products", element: <Products /> },
      { path: "profile", element: <Profile /> },
      { path: "login", element: <Login /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;