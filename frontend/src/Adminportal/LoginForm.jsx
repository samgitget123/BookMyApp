import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible, AiOutlinePhone } from 'react-icons/ai';
import { useBaseUrl } from '../Contexts/BaseUrlContext';
import { Link } from 'react-router-dom';
import sportsbanner from '../Images/sportstool.jpg';

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
      console.log(response , 'loginresponse');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('ground_name', response.data.ground_name);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('name', response.data.user.name);
      localStorage.setItem('role', response.data.user.role);
      navigate('/');
      setPhone('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <section className="min-vh-100 overflow-hidden">
      <div className="container-fluid p-0">
        <div className="row g-0 h-100">
          {/* Right Side - Login Form */}
          <div className="col-lg-4 col-md-6 col-12 d-flex justify-content-center align-items-center min-vh-100 secondaryColor">
            <div className="p-4 border rounded shadow bg-light w-100" style={{ maxWidth: "360px" }}>
              <h2 className="  mb-3 text-center text-dark">Login</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {/* Phone Number Field */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label text-dark">Phone Number</label>
                <div className="input-group">
                  <input
                    type="number"
                    id="phone"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    maxLength={10}
                    required
                  />
                  <span className="input-group-text bg-white border">
                    <AiOutlinePhone size={20} />
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-dark">Password</label>
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
                    className="input-group-text bg-white border"
                    style={{ cursor: 'pointer' }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </span>
                </div>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-success w-100 mb-3" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {/* Register Link */}
              <p className="text-center text-dark">
  Haven't registered yet? <span className="text-danger">Contact Support:</span>
  <span className="mx-1">
    <a href="tel:+9848851443" className="text-success  text-decoration-none">
      📞 Call
    </a>
  </span>|
  <span className="mx-1">
    <a href="https://wa.me/9848851443" className="text-warning  text-decoration-none" target="_blank" rel="noopener noreferrer">
      📱 WhatsApp
    </a>
  </span>|
  <span className="mx-1">
    <a href="mailto:sampathgoudarukala@gmail.com" className="text-primary  text-decoration-none">
      ✉️ Email
    </a>
  </span>
</p>






            </div>
          </div>
          {/* Left Side - Full Width Banner Image */}
          <div className="col-lg-8 col-md-6 d-none d-md-block position-relative">
            <img
              src={sportsbanner}
              alt="Login Banner"
              className="w-100 h-100"
              style={{ objectFit: "cover", position: "absolute", top: 0, left: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
