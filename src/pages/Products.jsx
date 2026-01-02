import { useState, useEffect } from 'react';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Laptop Dell', price: 15000000 },
        { id: 2, name: 'iPhone 15', price: 25000000 },
        { id: 3, name: 'Tai nghe Sony', price: 3000000 },
      ]);
    }, 800);
  }, []);

  return (
    <div>
      <h2>Danh Sách Sản Phẩm</h2>
      {products.length === 0 ? (
        <p>Đang tải...</p>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id}>
              <strong>{p.name}</strong> - {p.price.toLocaleString('vi-VN')} ₫
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;