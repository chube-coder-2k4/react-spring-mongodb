function Sidebar({menuItems, isOpen}) {
    if(!isOpen) {
        return null;
    }
  return (
    <aside className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        {menuItems.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;