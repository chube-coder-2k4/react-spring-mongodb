import { useEffect, useState } from 'react';

function MainContent() {
    const [count, setCount] = useState(0);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setProducts([
                { id: 1, name: 'Product A', price: 100 },
                { id: 2, name: 'Product B', price: 150 },
                { id: 3, name: 'Product C', price: 200 },
            ]);
        }, 1000);
    }, []);

  return (
    <main className="content">
      <h2>Danh sách sản phẩm</h2>
        {products.length === 0 ? (
            <p>Đang tải sản phẩm...</p>
        ) : (
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - {product.price.toLocaleString('vi-VN')} VND
                    </li>
                ))}
            </ul>
        )}


      <p>Bạn đã click nút tăng: <strong>{count}</strong> lần </p>
      <button onClick={() => setCount(count + 1)}> Tăng count </button>
    </main>
  );
}

export default MainContent;