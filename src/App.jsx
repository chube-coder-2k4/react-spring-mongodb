import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>My Product Management App</h1>
      </header>
      
      <div className="main-layout">
        <aside className="sidebar">
          <h2>Sidebar</h2>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>Profile</li>
            <li>Login</li>
          </ul>
        </aside>
        
        <main className="content">
          <h2>Welcome to Main Content</h2>
          <p>Đây là nơi hiển thị nội dung chính.</p>
        </main>
      </div>
    </div>
  )
}

export default App