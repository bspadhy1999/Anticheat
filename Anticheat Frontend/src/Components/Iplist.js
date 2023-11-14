import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import ReactPaginate from 'react-paginate'

export default function Iplist() {

  const [iplist, setIplist] = useState([]);

  const [pageCount, setpageCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const paramData = useParams();

  const navigate = useNavigate();

  const seeUSers = (ip) => {
    navigate(`/userlist/${paramData.id}/${ip}`);
  }

  const seeBlockedIp = () => {
    navigate(`/blocked-iplist/${paramData.id}`);
  }

  const itemsPerPage = 10;

  const fetchData = async (pageNo, itemsPerPage) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const request = { "id": paramData.id };
      const response = await axios.post(`http://172.105.47.32:8080/api/listIpAddress?pageNumber=${pageNo}&pageSize=${itemsPerPage}`, request, config);
      setIplist(response.data.data);
      const totalItems = response.data.totalItems;
      const totalPage = Math.ceil(totalItems / itemsPerPage);
      setpageCount(totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, itemsPerPage);
  }, []);

  const handleOnclick = (ip) => {
    Swal.fire({
      title: "Do you want to block this IP?",
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
          const response = await axios.post(`http://172.105.47.32:8080/api/blockIpAddress/${paramData.id}`, request, config);
          if (response.data.statusCodeValue === 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Ip blocked successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    })
  }

  const handlePageClick = (event) => {
    let currentPage = event.selected + 1;
    fetchData(currentPage, itemsPerPage);
  };

  return (
    <>
      <section className='p-4'>
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex justify-content-between pe-5 p-2 align-items-center">
              <h5 className='mb-4'><strong>IP LIST</strong></h5>
              <button type="button" className="btn btn-danger" onClick={seeBlockedIp}>VIEW BLOCKED IP</button>
            </div>
            <table className="table table-bordered table-striped">
              <thead style={{ "backgroundColor": "#e7c65d" }}>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">Count</th>
                  <th scope="col">See Users</th>
                  <th scope="col">Block Ip</th>
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
                  ) : iplist && iplist.length > 0 ? (
                    iplist.map((item, index) => {
                      return (
                        <tr key={index} className='table-light'>
                          <td>{index + 1}</td>
                          <td>{item.ipaddress}</td>
                          <td>{item.userCount}</td>
                          <td><button type='button' className='btn btn-success' onClick={() => seeUSers(item.ipaddress)}>SEE USERS</button></td>
                          <td><button type='button' className='btn btn-danger' onClick={() => handleOnclick(item.ipaddress)}>BLOCK IP</button></td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='table-light'>
                      <td colSpan='5'>No Data Found.</td>
                    </tr>
                  )}
              </tbody>
            </table>
            {
              iplist && iplist.length > 0 ? (
                <ReactPaginate
                  previousLabel="<< Previous"
                  nextLabel="Next >>"
                  breakLabel="..."
                  pageCount={pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName='pagination  justify-content-center'
                  pageClassName='page-item'
                  pageLinkClassName='page-link'
                  previousClassName='page-item'
                  previousLinkClassName='page-link'
                  nextClassName='page-item'
                  nextLinkClassName='page-link'
                  breakClassName='page-item'
                  breakLinkClassName='page-link'
                  activeClassName='active'
                />
              ) : null
            }
          </div>
        </div>
      </section>
    </>
  )
}
