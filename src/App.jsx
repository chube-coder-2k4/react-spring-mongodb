import './App.css'
import Hello from './components/Hello'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App