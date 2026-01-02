# Hướng Dẫn Xây Dựng Fullstack Project: Product Management (Role-Based)

Tài liệu này hướng dẫn chi tiết cách xây dựng ứng dụng quản lý sản phẩm với phân quyền (Admin/User) sử dụng **ReactJS**, **Spring Boot** và **MongoDB**.

---

## 1. Lý Thuyết & Luồng Hoạt Động (Logic)

### Mô hình Client-Server
*   **Frontend (React):** Là giao diện người dùng. Nhiệm vụ là hiển thị dữ liệu và gửi yêu cầu (Request) xuống Backend.
*   **Backend (Spring Boot):** Là bộ não xử lý logic. Nhiệm vụ là nhận Request, nói chuyện với Database, và trả về kết quả (Response).
*   **Database (MongoDB):** Là nơi lưu trữ dữ liệu bền vững (User, Product).

### Logic Xác Thực (Authentication) & Phân Quyền (Authorization) đơn giản
*Lưu ý: Đây là cách tiếp cận cơ bản để hiểu luồng dữ liệu, chưa áp dụng JWT hay Spring Security phức tạp.*

1.  **Login:**
    *   Client gửi `username` + `password` lên API `/api/auth/login`.
    *   Server tìm trong DB xem có user đó không.
    *   Nếu có và password trùng khớp -> Trả về thông tin User (bao gồm `role`).
    *   Client nhận được User -> Lưu vào bộ nhớ trình duyệt (localStorage/Context).
2.  **Phân quyền (Frontend):**
    *   Dựa vào `role` đã lưu. Nếu `role === 'ADMIN'` -> Hiển thị các nút Thêm/Sửa/Xóa.
    *   Nếu `role === 'USER'` -> Chỉ hiển thị danh sách và ô tìm kiếm.
3.  **Bảo vệ API (Backend):**
    *   Các API `/api/admin/**` sẽ được quy định chỉ dành cho Admin (Ở mức cơ bản này, ta sẽ tách Controller để dễ quản lý).

---

## 2. Công Cụ Cần Thiết

1.  **JDK 17+**: Để chạy Java Spring Boot.
2.  **Node.js & npm**: Để chạy React.
3.  **MongoDB**: Database (Có thể cài MongoDB Compass để xem dữ liệu).
4.  **Postman**: Để test API trước khi ghép vào Frontend.
5.  **IDE**: VS Code (Frontend) và IntelliJ IDEA hoặc Eclipse (Backend).

---

## 3. Cấu Trúc Folder Hợp Lý (Best Practice)

Dưới đây là cấu trúc thư mục chuẩn cho dự án Fullstack (Monorepo hoặc tách riêng đều được).

### Backend (Spring Boot)
```text
src/main/java/com/example/project
├── config/             # Cấu hình (CORS, Mongo...)
├── controller/         # Nơi định nghĩa API Endpoint (Tiếp nhận Request)
├── model/              # Định nghĩa cấu trúc dữ liệu (Entity/Document)
├── repository/         # Giao tiếp trực tiếp với DB (Interface)
├── service/            # Xử lý logic nghiệp vụ (Business Logic)
└── ProjectApplication.java
```

### Frontend (React)
```text
src/
├── assets/             # Ảnh, font, global css
├── components/         # Các thành phần nhỏ dùng chung (Header, Button...)
├── context/            # Quản lý state toàn cục (AuthContext)
├── layouts/            # Bố cục trang (MainLayout, AuthLayout)
├── pages/              # Các trang chính (Login, Home, AdminDashboard)
├── services/           # Gọi API (axios config)
├── utils/              # Các hàm tiện ích
└── App.jsx             # Routing
```

---

## 4. Triển Khai Backend (Spring Boot)

### Bước 1: Dependencies (`pom.xml`)
Cần thêm các thư viện sau:
*   Spring Web
*   Spring Data MongoDB
*   Lombok (để viết code ngắn gọn hơn)

### Bước 2: Cấu hình DB (`application.properties`)
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/product_db
server.port=8080
```

### Bước 3: Models

**User.java**
```java
@Document(collection = "users")
@Data // Lombok
public class User {
    @Id
    private String id;
    private String username;
    private String password; // Lưu ý: Thực tế nên mã hóa (BCrypt)
    private String role; // "ADMIN" hoặc "USER"
}
```

**Product.java**
```java
@Document(collection = "products")
@Data
public class Product {
    @Id
    private String id;
    private String name;
    private Double price;
    private String description;
}
```

### Bước 4: Repositories
```java
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByNameContainingIgnoreCase(String keyword); // Search
}
```

### Bước 5: Services & Controllers

**AuthController.java**
```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép React gọi
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> user = userRepository.findByUsername(req.getUsername());
        if (user.isPresent() && user.get().getPassword().equals(req.getPassword())) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
    }
}
```

**ProductController.java (Public)**
```java
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

**AdminProductController.java (Admin Only)**
```java
@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {
    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        productRepository.deleteById(id);
    }
}
```

---

## 5. Triển Khai Frontend (React)

### Bước 1: Cấu hình API (`src/services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const loginAPI = (credentials) => api.post('/auth/login', credentials);
export const getProductsAPI = () => api.get('/products');
export const searchProductsAPI = (keyword) => api.get(`/products/search?keyword=${keyword}`);

// Admin APIs
export const createProductAPI = (data) => api.post('/admin/products', data);
export const updateProductAPI = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProductAPI = (id) => api.delete(`/admin/products/${id}`);
```

### Bước 2: Quản lý Auth State (`src/context/AuthContext.jsx`)
Tạo một Context để lưu user toàn cục, giúp ta biết ai đang đăng nhập ở bất kỳ trang nào.

```javascript
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Lấy user từ localStorage nếu có (để F5 không bị mất login)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

### Bước 3: Xử lý Logic tại các trang

**Login.jsx**
```javascript
const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await loginAPI({ username, password });
        login(res.data); // Lưu vào context
        
        // Điều hướng dựa trên role
        if (res.data.role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/products');
        
    } catch (err) {
        alert("Đăng nhập thất bại");
    }
};
```

**Products.jsx (Hiển thị theo Role)**
```javascript
const { user } = useAuth();

// ... code lấy danh sách sản phẩm ...

return (
    <div>
        {/* Chỉ Admin mới thấy nút Thêm */}
        {user?.role === 'ADMIN' && (
            <button onClick={handleAddProduct}>Thêm Sản Phẩm Mới</button>
        )}

        {products.map(p => (
            <div key={p.id}>
                <h3>{p.name}</h3>
                
                {/* Chỉ Admin mới thấy nút Sửa/Xóa */}
                {user?.role === 'ADMIN' && (
                    <div>
                        <button onClick={() => handleEdit(p)}>Sửa</button>
                        <button onClick={() => handleDelete(p.id)}>Xóa</button>
                    </div>
                )}
            </div>
        ))}
    </div>
)
```

---

## 6. Lưu ý & Best Practices

1.  **Bảo mật (Quan trọng):**
    *   Trong dự án thật, **KHÔNG BAO GIỜ** lưu password dạng plain-text. Phải dùng thư viện mã hóa (như BCrypt).
    *   Nên sử dụng **JWT (JSON Web Token)** và **Spring Security** để bảo vệ API thay vì chỉ check role ở Frontend. Frontend chỉ là lớp vỏ, Hacker vẫn có thể dùng Postman gọi thẳng vào API Admin nếu Backend không chặn.

2.  **Validation:**
    *   Backend: Dùng `@Valid` và `@NotNull` trong Java để đảm bảo dữ liệu gửi lên không bị thiếu.
    *   Frontend: Kiểm tra form trước khi gửi request.

3.  **UX (Trải nghiệm người dùng):**
    *   Luôn có trạng thái `loading` khi gọi API.
    *   Thông báo lỗi rõ ràng (Toast message) thay vì `alert()`.

4.  **Môi trường:**
    *   Tách biến môi trường (URL Backend, DB connection) ra file `.env` (Frontend) và `application.properties` (Backend) để dễ cấu hình khi deploy.
