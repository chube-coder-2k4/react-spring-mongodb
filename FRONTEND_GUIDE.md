# Hướng Dẫn Triển Khai Frontend ReactJS (Dành cho Backend Developer)

Chào bạn, vì bạn xuất thân từ Backend, tài liệu này sẽ tập trung giải thích các khái niệm Frontend dựa trên tư duy hệ thống để bạn dễ nắm bắt. Chúng ta sẽ xây dựng giao diện để tương tác với các API bạn đã có.

---

## 1. Tư Duy: Frontend khác gì Backend?

*   **Backend:** Nhận Request -> Xử lý Logic/DB -> Trả về Response. (Stateless - thường là vậy).
*   **Frontend:** Nhận User Action (Click, Type) -> Cập nhật **State** -> Giao diện tự thay đổi theo State. (Stateful).
    *   *Ví dụ:* Biến `user` là null -> Giao diện hiện nút "Login". Biến `user` có dữ liệu -> Giao diện hiện "Xin chào Admin".
    *   **State** chính là "Database tạm thời" trong bộ nhớ trình duyệt.

---

## 2. Cấu Trúc Thư Mục (Best Practice)

Chúng ta sẽ chia code theo chức năng, giống như Controller/Service/Repository bên Backend.

```text
src/
├── context/            # Giống như "Session" toàn cục (Lưu user đang login)
│   └── AuthContext.jsx
├── services/           # Giống như "Repository/Client" (Nơi gọi API)
│   └── api.js
├── components/         # Các mảnh giao diện nhỏ dùng chung
│   ├── Header.jsx
│   └── PrivateRoute.jsx # Middleware kiểm tra quyền
├── pages/              # Các màn hình chính (Giống View)
│   ├── Login.jsx
│   ├── ProductList.jsx
│   └── AdminProduct.jsx
└── App.jsx             # Routing (Giống file cấu hình Route)
```

---

## 3. Triển Khai Chi Tiết

### Bước 1: Service Layer (Gọi API)
Tách biệt việc gọi API ra khỏi giao diện. Giúp code gọn và dễ sửa URL sau này.

**File:** `src/services/api.js`

```javascript
import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // URL Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Auth API ---
export const loginAPI = (credentials) => {
    // credentials = { username: "...", password: "..." }
    return api.post('/auth/login', credentials);
};

// --- Product API (Public) ---
export const getProductsAPI = () => api.get('/products');
export const searchProductsAPI = (keyword) => api.get(`/products/search?keyword=${keyword}`);
export const getProductByIdAPI = (id) => api.get(`/products/${id}`);

// --- Admin API (Protected) ---
// Lưu ý: Thực tế cần gửi kèm Token, nhưng ở bài này ta làm đơn giản
export const createProductAPI = (product) => api.post('/admin/products', product);
export const updateProductAPI = (id, product) => api.put(`/admin/products/${id}`, product);
export const deleteProductAPI = (id) => api.delete(`/admin/products/${id}`);

export default api;
```

---

### Bước 2: AuthContext (Quản lý trạng thái đăng nhập)
Đây là phần quan trọng nhất. Thay vì truyền biến `user` qua từng component (Props Drilling), ta dùng `Context` để biến `user` thành biến toàn cục (Global State).

**File:** `src/context/AuthContext.jsx`

```javascript
import { createContext, useState, useContext, useEffect } from 'react';

// 1. Khởi tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider (Nhà cung cấp dữ liệu)
export const AuthProvider = ({ children }) => {
    // State lưu thông tin user.
    // Khởi tạo bằng cách đọc từ localStorage để khi F5 không bị mất login.
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Hàm login: Cập nhật state và lưu vào localStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Hàm logout: Xóa state và xóa localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Trả về các giá trị cho toàn bộ app sử dụng
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook tùy chỉnh để dùng nhanh ở các file khác
export const useAuth = () => useContext(AuthContext);
```

---

### Bước 3: PrivateRoute (Middleware bảo vệ trang Admin)
Giống như `Filter` hoặc `Interceptor` trong Backend. Nếu chưa login hoặc không phải Admin thì đá ra ngoài.

**File:** `src/components/PrivateRoute.jsx`

```javascript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { user } = useAuth();

    // 1. Chưa đăng nhập -> Đá về trang login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 2. Có quy định role và user không đủ quyền -> Đá về trang chủ hoặc trang lỗi
    if (roles && !roles.includes(user.role)) {
        alert("Bạn không có quyền truy cập trang này!");
        return <Navigate to="/" />;
    }

    // 3. Hợp lệ -> Cho phép hiển thị nội dung con (Outlet)
    return <Outlet />;
};

export default PrivateRoute;
```

---

### Bước 4: Trang Login (Xử lý Form)

**File:** `src/pages/Login.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Lấy context
import { loginAPI } from '../services/api';       // Lấy hàm gọi API

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Lấy hàm login từ context
    const navigate = useNavigate(); // Dùng để chuyển trang

    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn reload trang
        try {
            // 1. Gọi API Backend
            const response = await loginAPI({ username, password });
            
            // 2. API trả về OK -> Lưu user vào Context
            // response.data = { id: 1, username: "admin", role: "ADMIN" }
            login(response.data);

            // 3. Điều hướng dựa trên Role
            if (response.data.role === 'ADMIN') {
                navigate('/admin/products');
            } else {
                navigate('/products');
            }
        } catch (error) {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ... Input Username & Password ... */}
            <button type="submit">Đăng Nhập</button>
        </form>
    );
}
export default Login;
```

---

### Bước 5: Trang Danh Sách Sản Phẩm (User View)
Logic: Load dữ liệu khi vào trang (`useEffect`), và lọc dữ liệu khi tìm kiếm.

**File:** `src/pages/ProductList.jsx`

```javascript
import { useEffect, useState } from 'react';
import { getProductsAPI, searchProductsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const { user } = useAuth(); // Lấy user để check role nếu cần hiển thị nút đặc biệt

    // useEffect với mảng rỗng [] -> Chạy 1 lần duy nhất khi component được mount (giống @PostConstruct)
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getProductsAPI();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async () => {
        if (!keyword.trim()) {
            fetchProducts(); // Nếu ô tìm kiếm rỗng -> Lấy tất cả
            return;
        }
        const res = await searchProductsAPI(keyword);
        setProducts(res.data);
    };

    return (
        <div>
            {/* Ô tìm kiếm */}
            <div className="search-box">
                <input 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)} 
                    placeholder="Tìm sản phẩm..." 
                />
                <button onClick={handleSearch}>Tìm</button>
            </div>

            {/* Danh sách */}
            <div className="grid">
                {products.map(p => (
                    <div key={p.id} className="card">
                        <h3>{p.name}</h3>
                        <p>{p.price} VND</p>
                        {/* Logic hiển thị có điều kiện: Chỉ Admin mới thấy nút Sửa */}
                        {user?.role === 'ADMIN' && <button>Sửa (Admin Only)</button>}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ProductList;
```

---

### Bước 6: Trang Quản Lý (Admin View - CRUD)
Logic: Kết hợp Form (để tạo/sửa) và List (để hiển thị).

**File:** `src/pages/AdminProduct.jsx`

```javascript
import { useState, useEffect } from 'react';
import { getProductsAPI, createProductAPI, deleteProductAPI } from '../services/api';

function AdminProduct() {
    const [products, setProducts] = useState([]);
    // State cho form thêm mới
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getProductsAPI();
        setProducts(res.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
            await deleteProductAPI(id);
            loadData(); // Load lại danh sách sau khi xóa
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await createProductAPI(newProduct);
        setNewProduct({ name: '', price: '' }); // Reset form
        loadData(); // Load lại danh sách
    };

    return (
        <div>
            <h2>Quản Lý Sản Phẩm (Admin)</h2>
            
            {/* Form Thêm Mới */}
            <form onSubmit={handleCreate}>
                <input 
                    placeholder="Tên SP" 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
                <input 
                    placeholder="Giá" 
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
                <button type="submit">Thêm Mới</button>
            </form>

            {/* Bảng Danh Sách */}
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>
                                <button onClick={() => handleDelete(p.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default AdminProduct;
```

---

### Bước 7: Cấu hình Route (App.jsx)

**File:** `src/App.jsx`

```javascript
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import AdminProduct from './pages/AdminProduct';

function App() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProductList />} />
      <Route path="/products" element={<ProductList />} />

      {/* Route bảo vệ (Chỉ Admin) */}
      <Route element={<PrivateRoute roles={['ADMIN']} />}>
        <Route path="/admin/products" element={<AdminProduct />} />
      </Route>
    </Routes>
  );
}
export default App;
```

---

## 4. Tổng Kết & Lưu Ý

1.  **Async/Await:** Luôn dùng `async/await` khi gọi API để code dễ đọc (giống code đồng bộ bên Java).
2.  **Optional Chaining (`?.`):** Khi truy cập thuộc tính sâu (ví dụ `user.role`), hãy dùng `user?.role` để tránh lỗi `null pointer` nếu user chưa đăng nhập.
3.  **Separation of Concerns:** Đừng viết logic gọi API trực tiếp trong component (`useEffect`). Hãy tách ra file `api.js`. Component chỉ nên lo việc hiển thị.
