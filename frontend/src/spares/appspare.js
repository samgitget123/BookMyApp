import React from 'react';
import Header from './Components/Sections/Header';
import Home from './Components/Sections/Home';
import ViewGround from './Components/Sections/ViewGround';
import Payment from './Components/Sections/Payment';
import CreateGroundForm from './Components/Sections/CreategroundForm';
import WelcomeHome from './Components/Sections/Home/WelcomeHome';
//login
import RegisterForm from './Adminportal/RegisterForm';
import LoginForm from './Adminportal/LoginForm';
import NotFoundScreen from './Components/Sections/requires/NotFoundScreen';
import { BaseUrlProvider } from './Contexts/BaseUrlContext';
import BookDetailsModal from './Components/Modals/BookDetailsModal';
//private
import PrivateRoute from './PrivateRoute';
// Redux
import { store } from './store';
import { Provider } from 'react-redux';

// Routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CSS
import './App.css';
import Footer from './Components/Sections/Footer';
//Admin
import AdminDashboard from './Adminportal/AdminDashboard';
const App = () => {
  return (
   <Provider store={store}>
      <BaseUrlProvider>
      <Router>
        <div className="app-container">
        <Header /> {/* Placed outside of <main> so that header appears on all pages */}
        <main className="app-main">
            <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<WelcomeHome />} />
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/createground" element={<CreateGroundForm />} exact />
              <Route path="/viewground/:gid" element={<ViewGround />} />
              <Route path="/payment/:gid" element={<Payment />} />
              <Route path="/bookingdetails/:slot" element={<BookDetailsModal/>}/>
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
        </main>
        <Footer/>
        </div>
      </Router>
      </BaseUrlProvider>
      </Provider>
  );
};

export default App;
