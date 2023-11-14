import React, { useEffect, useState } from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios'

export default function Header() {

  const navigate = useNavigate();

  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login'));

  useEffect(() => {
    const loginStatus = localStorage.getItem('token');
    setIsLoggedIn(loginStatus);
  }, [location]);

  const handleLogout = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const response =await axios.get("http://172.105.47.32:8080/api/admin/logout", config);
      if(response.data.status === "success"){
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{"backgroundColor":"#009681"}}>
        <div className="container-fluid">
          <Link style={{"color":"white", "fontWeight":"700", "fontSize":"26px"}} className="navbar-brand" to="/home">ANTI CHEAT PANEL</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {isLoggedIn && (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link style={{ color: 'white', fontWeight: '600', fontSize: '17px' }} className="nav-link active" aria-current="page" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link style={{ color: 'white', fontWeight: '600', fontSize: '17px' }} className="nav-link active" to="/websites">
                    Websites
                  </Link>
                </li>
                <li className="nav-item">
                  <Link style={{ color: 'white', fontWeight: '600', fontSize: '17px' }} className="nav-link active" to="/user-setting">
                    User Setting
                  </Link>
                </li>
                <li className="nav-item">
                  <Link style={{ color: 'white', fontWeight: '600', fontSize: '17px' }} className="nav-link active" to="/user-setting">
                    {localStorage.getItem('userName')}
                  </Link>
                </li>
                <li className="nav-item" >
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '17px', cursor:"pointer" }} className="nav-link active" onClick={handleLogout}>Logout</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
