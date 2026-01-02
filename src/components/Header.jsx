import { useState } from 'react';

function Header({title}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    return (
        <header className="header">
            <h1>{title}</h1>
            <button onClick={toggleSidebar} style={{marginLeft: '20px'}}>
                {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
        </header>
    );
}

export default Header;