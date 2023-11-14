import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    userName: "",
    password: "",
  })

  const [errormsg, seterrormsg] = useState("")

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
    seterrormsg("");
  };

  const handleRegister = async () => {
    try {
      const response =await axios.post("http://172.105.47.32:8080/api/auth/user", user);
        if(response.data.status === "success") {
          localStorage.setItem("userName", user.userName);
          localStorage.setItem("token", response.data.message);
          navigate("/home");
        }
        else if(response.data.status === "error") {
          seterrormsg("Username or password is wrong!");
        }
    } catch (err) {
        console.log(err);
    }
  }

  useEffect(() => {
    const login=localStorage.getItem('token');
    if(login) {
        navigate("/home");
    }
}, [])

const isDisabled = !user.userName || !user.password; 

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center mt-5 pt-5">
          <div className="col-md-5">
            <div className="card">
              <div className="card-header" style={{ "backgroundColor": "#e7c65d" }}>
                <p className="card-title">Login</p>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="exampleInputUsername" className="form-label">Username</label>
                  <input type="text" className="form-control" onChange={handleOnchange} value={user.userName} name="userName" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" onChange={handleOnchange} value={user.password} name="password" />
                </div>
                <p className='text-danger'>{errormsg}</p>
                <div className="mb-3">
                  <button style={{ "width": "100%", "backgroundColor": "#009681" }} className="btn btn-primary" onClick={handleRegister} disabled={isDisabled}>Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
