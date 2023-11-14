import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function UserSetting() {

  const [user, setUser] = useState({
    userName: "",
    password: "",
  })

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (user.userName && user.password) {
      try {
        const config = {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        };
        const res = await axios.post('http://172.105.47.32:8080/api/admin/save', user, config);
        if (res.data.status === 'success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User created successfully',
            showConfirmButton: false,
            timer: 1500,
          });
          setUser({
            userName: '',
            password: '',
          });
          fetchUsersData();
        }
        else if(res.data.status === 'error'){
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
      } catch (err) {
        console.log(err);
      }
    }
    else {
      toast.error('Enter a valid UserId and Password !', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }
  };

  const [users, setUsers] = useState([]);

  const [updatedPasswords, setUpdatedPasswords] = useState({});

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const request = { id: id };
      const response = await axios.post('http://172.105.47.32:8080/api/admin/delete', request, config);
      if (response.data.status === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User deleted successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchUsersData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id) => {
    const passwordToUpdate = updatedPasswords[id] !== undefined ? updatedPasswords[id] : user.password;
    if (!passwordToUpdate || passwordToUpdate.trim() === '') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Password must be required !',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const request = { id: id, password: passwordToUpdate };
      const response = await axios.post('http://172.105.47.32:8080/api/admin/updatePassword',request, config);
      if (response.data.status === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchUsersData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsersData = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const res = await axios.get('http://172.105.47.32:8080/api/admin/list', config);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <>
      <ToastContainer style={{"width":"350px"}}/>
      <section className='p-4'>
        <div className="row">
          <div className="col-md-12">
            <h5 className='mb-4'><strong>CREATE USER</strong></h5>
              <table className="table table-bordered">
                <thead style={{ "backgroundColor": "#e7c65d" }}>
                  <tr>
                    <th scope="col">UserID</th>
                    <th scope="col">Password</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='table-light'>
                    <td><input type="text" placeholder='UserId' className='form-control' onChange={handleOnchange} value={user.userName} name="userName" /></td>
                    <td><input type="password" placeholder='Password' className='form-control' onChange={handleOnchange} value={user.password} name="password" /></td>
                    <td><button className="btn btn-success" onClick={(e)=>handleRegister(e)}>ADD USER</button></td>
                  </tr>
                </tbody>
              </table>
            <h5 className='mb-4'><strong>USER LIST</strong></h5>
            <table className="table table-bordered">
              <thead style={{ "backgroundColor": "#009681" }}>
                <tr className='text-white'>
                  <th scope="col">UserID</th>
                  <th scope="col">Password</th>
                  <th scope="col">Change</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  users && users.length > 0 ? (
                    users.map((item, index) => {
                      return <tr key={index} className='table-light'>
                        <td>{item.userName}</td>
                        <td><input type='text' className='form-control' value={updatedPasswords[item.id] !== undefined ? updatedPasswords[item.id] : item.password} onChange={(e) => {
                        const value = e.target.value;
                        setUpdatedPasswords((prevState) => ({
                          ...prevState,
                          [item.id]: value,
                        }));
                      }}></input></td>
                        <td><button type="button" className="btn btn-success" onClick={() => handleUpdate(item.id)}>CHANGE PWD</button></td>
                        <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>DELETE</button></td>
                      </tr>
                    })
                  ) : (
                    <tr className='table-light'>
                      <td colSpan="4">No Data Found.</td>
                    </tr>
                  ) 
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
