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
        <div className="login-page">
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-control"
                        placeholder="Nhập username"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                        placeholder="Nhập password"
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
            </form>
            {message && <p className={message.includes('thành công') ? 'success-message' : 'error-message'}>{message}</p>}
            <p style={{marginTop: '20px', color: '#7f8c8d'}}>
                Thử: admin / password (ADMIN)<br/>
                Thử: user / password (USER)
            </p>
        </div>
    );
}

export default Login;