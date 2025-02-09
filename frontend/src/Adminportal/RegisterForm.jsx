import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError(''); // Clear previous error when the user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Optional: Add phone number validation
    const phoneRegex = /^[0-9]{10}$/; // Example regex for 10-digit phone number
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name,
        phone_number: phone,
        password,
      });

      setMessage(response.data.message);

      // Clear input fields
      setName('');
      setPhone('');
      setPassword('');

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Delay to show success message before redirecting

    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div>
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow secondaryColor" style={{ width: '320px' }}>
          <h2 className="mb-4 text-center text-light">Register</h2>
          <span className="borderline text-center"></span>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Name Field */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-light">Name</label>
            <div className="input-group">
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
              <span className="input-group-text bg-white border-0">
                <AiOutlineUser size={20} />
              </span>
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="mb-3">
            <label htmlFor="phone" className="form-label text-light">Phone Number</label>
            <div className="input-group">
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                required
              />
              <span className="input-group-text bg-white border-0">
                <AiOutlinePhone size={20} />
              </span>
            </div>
          </div>

          {/* Password Field with Eye Icon (React Icons) */}
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
              <span className="input-group-text bg-white border-0" style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
