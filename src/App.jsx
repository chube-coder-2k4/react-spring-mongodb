import './App.css'
import Hello from './components/Hello'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  const menuItems = ['Home', 'Products', 'Profile', 'Login', 'Settings'];

  return (
    <div className="app">
      <Header title="My Product Management App"/>
      <div className="main-layout">
        <Sidebar menuItems={menuItems}/>
        <MainContent />
      </div>
    </div>
  );
}

export default App