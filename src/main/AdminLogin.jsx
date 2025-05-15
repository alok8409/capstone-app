import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting admin login:', formData);
            const response = await axios.post('http://localhost:5000/admin/login', formData);
            console.log('Admin login response:', response.data);
            if (response.data.admin) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminId', response.data.admin.id);
                localStorage.setItem('adminUsername', response.data.admin.username);
                navigate('/admin/dashboard');
            } else {
                setError('Invalid response from server');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Admin Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;