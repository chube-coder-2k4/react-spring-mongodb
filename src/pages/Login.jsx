function Login() {
  return (
    <div>
      <h2>Đăng Nhập</h2>
      <form style={{ maxWidth: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label><br/>
          <input type="text" style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label><br/>
          <input type="password" style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="button" style={{ padding: '10px 20px' }}>
          Đăng Nhập
        </button>
      </form>
    </div>
  );
}

export default Login;