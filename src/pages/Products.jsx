import { useState, useEffect } from 'react';
import { getProducts } from '../services/api'; 

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(response => {
        setProducts(response);
        setLoading(false);
        })
        .catch(() => {
            setError('Lỗi khi tải sản phẩm');
            setLoading(false);
        });
    }, []);

    if(loading) {
        return <p>Đang tải...</p>;
    }
    if(error) {
        return <p>{error}</p>;
    }

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