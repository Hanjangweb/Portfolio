const testLogin = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });
    const data = await response.json();
    console.log('Login response:', data);
  } catch (error) {
    console.error('Login error:', error.message);
  }
};

testLogin();
