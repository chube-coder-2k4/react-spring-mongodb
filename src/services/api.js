import axios from "axios";

const api = axios.create({
    baseURL: "", // để trống vì đang mock data
    timeout: 5000,
});

export const getProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Laptop Dell', price: 15000000 },
                { id: 2, name: 'iPhone 15', price: 25000000 },
                { id: 3, name: 'Tai nghe Sony', price: 3000000 },
            ]);
        }, 800);
    });
}

export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === "admin" && password === "password") {
                resolve({
                    data: {
                        token: 'fake-jwt-token-admin-12345',
                        user: { name: 'Admin User', role: 'ADMIN' }
                    }
                });
            } else if (username === "user" && password === "password") {
                resolve({
                    data: {
                        token: 'fake-jwt-token-user-67890',
                        user: { name: 'Regular User', role: 'USER' }
                    }
                });
            } else {
                reject({response : { data:  { message: 'Invalid credentials' } } });
            }
        }, 1000);
    });
}

export default api;