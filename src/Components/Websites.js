import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Websites() {

  const [website, setWebsite] = useState({
    name: "",
    url: "",
  })

  const [editedWebsite, setEditedWebsite] = useState({
    name: "",
    url: "",
    status: false,
  });

  const handleCheckBoxChange = (e, index) => {
    const newWebsites = [...websites];
    newWebsites[index].status = e.target.checked;
    setEditedWebsite({ ...editedWebsite, status: e.target.checked });
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setWebsite(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditedWebsiteOnchange = (e, index, field) => {
    const { value } = e.target;
    const newWebsites = [...websites];
    newWebsites[index][field] = value;
    setWebsites(newWebsites);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (website.name && website.url) {
      try {
        const config = {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        };
        const res = await axios.post("http://172.105.47.32:8080/api/website/save", website, config);
        if (res.data.status === 'success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Website created successfully',
            showConfirmButton: false,
            timer: 1500,
          });
          setWebsite({
            name: "",
            url: "",
          });
          fetchWebsitesData();
        }
      } catch (err) {
        console.log(err);
      }
    }
    else {
      toast.error('Enter a valid Website Name and Url !', {
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

  const [websites, setWebsites] = useState([]);

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const request = { id: id };
      const response = await axios.post("http://172.105.47.32:8080/api/website/delete", request, config);
      if (response.data.status === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Website deleted successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchWebsitesData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id) => {
    const editedItem = websites.find((item) => item.id === id);
    let { name, url, status } = editedItem;
    if (!name || !url) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Website name or URL must be required!',
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
      const request = {
        id: id,
        name: name,
        url: url,
        status: status,
      };
      const response = await axios.post("http://172.105.47.32:8080/api/website/update", request, config);
      if (response.data.status === "success") {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Website updated successfully',
          showConfirmButton: false,
          timer: 1500
        });
        fetchWebsitesData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWebsitesData = async () => {
    try {
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const response = await axios.get("http://172.105.47.32:8080/api/website/listAll", config);
      setWebsites(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWebsitesData();
  }, []);

  return (
    <>
      <ToastContainer style={{ "width": "360px" }} />
      <section className='p-4'>
        <div className="row">
          <div className="col-md-12">
            <h5 className='mb-4'><strong>WHITELIST WEBSITES</strong></h5>
            <table className="table table-bordered">
              <thead style={{ "backgroundColor": "#e7c65d" }}>
                <tr>
                  <th scope="col">Website Name</th>
                  <th scope="col">Website URL</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className='table-light'>
                  <td><input type="text" placeholder='Website Name' className='form-control' onChange={handleOnchange} value={website.name} name="name" /></td>
                  <td><input type="text" placeholder='Website URL' className='form-control' onChange={handleOnchange} value={website.url} name="url" /></td>
                  <td><button type="button" className="btn btn-success" onClick={handleRegister}>ADD</button></td>
                </tr>
              </tbody>
            </table>
            <h5 className='mb-4'><strong>WEBSITE LIST</strong></h5>
            <table className="table table-bordered">
              <thead style={{ "backgroundColor": "#009681" }}>
                <tr className='text-white'>
                  <th scope="col">Website Name</th>
                  <th scope="col">Website URL</th>
                  <th scope="col">Active Status</th>
                  <th scope="col">Update</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {websites && websites.length > 0 ? (
                  websites.map((item, index) => {
                    return (
                      <tr key={index} className="table-light">
                        <td>
                          <input
                            type="text"
                            placeholder="Website Name"
                            className="form-control"
                            value={item.name}
                            onChange={(e) => handleEditedWebsiteOnchange(e, index, "name")}
                            name="name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Website URL"
                            className="form-control"
                            value={item.url}
                            onChange={(e) => handleEditedWebsiteOnchange(e, index, "url")}
                            name="url"
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={editedWebsite.status || item.status}
                            onChange={(e) => handleCheckBoxChange(e, index)}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handleUpdate(item.id)}
                          >
                            UPDATE
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="table-light">
                    <td colSpan="5">No Data Found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
