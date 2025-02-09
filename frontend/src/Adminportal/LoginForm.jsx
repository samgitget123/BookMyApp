import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible, AiOutlinePhone } from 'react-icons/ai';
import { useBaseUrl } from '../Contexts/BaseUrlContext';
import { Link } from 'react-router-dom';
const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const { baseUrl } = useBaseUrl();
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/user/loginUser`, {
        phone_number: phone,
        password: password,
      });
      console.log(response.data?.user?.id , 'loginresponse');
      console.log('Login successful:', response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('name', response.data.user.name);
     navigate('/Home');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div>
        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded shadow secondaryColor"
          style={{ width: '320px' }}
        >
          <h2 className="mb-4 text-center text-light">Login</h2>
          <span className='borderline text-center'></span>
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Phone Number Field with Icon */}
          <div className="mb-3">
            <label htmlFor="phone" className="form-label text-light">Phone Number</label>
            <div className="input-group">

              <input
                type="text"
                id="phone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
              <span className="input-group-text bg-white border-0">
                <AiOutlinePhone size={20} />
              </span>
            </div>
          </div>

          {/* Password Field with Eye Icon */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <span
                className="input-group-text bg-white border-0"
                style={{ cursor: 'pointer' }}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <span className='text-center text-light'>
            Haven't registered yet? Let's <Link to="/register" className="text-warning">Register</Link>
          </span>
        </form>

      </div>

    </div>
  );
};

export default LoginForm;
