import { useState } from 'react';
import { login } from '../services/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await login(username, password);
            setMessage(`Đăng nhập thành công! Chào mừng ${response.data.user.role}`);
            console.log('Token:', response.data.token);
            // Lưu token vào localStorage hoặc context nếu cần
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi đăng nhập');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleLogin} style={{maxWidth: '350px'}}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        placeholder="Nhập username"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        placeholder="Nhập password"
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
            </form>
            {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
            <p>
                Thử: admin / password (ADMIN)<br/>
                Thử: user / password (USER)
            </p>
        </div>
    );
}

export default Login;