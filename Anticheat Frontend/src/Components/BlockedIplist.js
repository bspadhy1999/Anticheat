import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function BlockedIplist() {

  const paramData = useParams();

  const [blockediplist, setBlockedIpList] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const request = { "ipAddress": "123.456.789" };
      const response = await axios.post(`http://172.105.47.32:8080/api/getBlockedIp/${paramData.id}?pageNumber=1&pageSize=10`, request, config);
      setBlockedIpList(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnclick = (ip) => {
    Swal.fire({
      title: "Do you want to unblock this IP?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          };
          const request = { "ipAddress": ip };
          const response = await axios.post(`http://172.105.47.32:8080/api/deleteIp/${paramData.id}`, request, config);
          if (response.data.statusCodeValue === 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Ip unblocked successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData();
          }
        } catch (error) {
          console.log(error);
        }
      }
    })
  }

  return (
    <>
      <section className='p-4'>
        <div className="row">
          <div className="col-md-12">
            <h5 className='mb-4'><strong>BLOCK IP LIST</strong></h5>
            <table className="table table-bordered table-striped">
              <thead style={{ "backgroundColor": "#e7c65d" }}>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">Website Name</th>
                  <th scope="col">ID</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr className='table-light'>
                      <td colSpan='5'>
                        <div className='text-center'>
                          <div className='spinner-border' role='status' style={{ color: "#009681" }}>
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : blockediplist && blockediplist.length > 0 ? (
                    blockediplist.map((item, index) => {
                      return <tr key={index} className='table-light'>
                        <td>{index + 1}</td>
                        <td>wincric.bet</td>
                        <td>{item.ipAdress}</td>
                        <td>{item.id}</td>
                        <td><button type="button" className="btn btn-danger" onClick={() => handleOnclick(item.ipAdress)}>UNBLOCK IP</button></td>
                      </tr>
                    })
                  ) : (
                    <tr className='table-light'>
                      <td colSpan="5">No Data Found.</td>
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
