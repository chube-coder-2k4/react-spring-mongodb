function Sidebar({menuItems}) {
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