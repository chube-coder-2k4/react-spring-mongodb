import './App.css'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { useState } from 'react';

function App() {
  const menuItems = ['Home', 'Products', 'Profile', 'Login', 'Settings'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="app">
      <Header 
      title="My Product Management App"
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="main-layout">
        <Sidebar menuItems={menuItems} isOpen={isSidebarOpen} />
        <MainContent />
      </div>
    </div>
  );
}

export default App