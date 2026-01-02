import { useState } from 'react';

function MainContent() {
    const [count, setCount] = useState(0);
  return (
    <main className="content">
      <h2>Welcome to Main Content</h2>
      <p>Đây là nơi hiển thị nội dung chính.</p>
      <p>Bạn đã click nút tăng: <strong>{count}</strong> lần </p>
      <button onClick={() => setCount(count + 1)}> Tăng count </button>
    </main>
  );
}

export default MainContent;