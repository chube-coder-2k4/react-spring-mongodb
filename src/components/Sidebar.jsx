import { Link } from 'react-router-dom';

function Sidebar({menuItems, isOpen}) {
    if(!isOpen) {
        return null;
    }
  return (
    <aside className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path}>{item.name}</Link>
            </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;