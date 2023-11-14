import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'

export default function Userlist() {

  const paramData = useParams();

  const [userlist, setUserlist] = useState([]);

  const [pageCount, setpageCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const fetchData = async (pageNo, itemsPerPage) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const request = { "ipAddress": paramData.ip };
      const response = await axios.post(`http://172.105.47.32:8080/api/ipUsersList/${paramData.id}?pageNumber=${pageNo}&pageSize=${itemsPerPage}`, request, config);
      setUserlist(response.data.data);
      const totalItems = response.data.totalItems;
      const totalPage = Math.ceil(totalItems / itemsPerPage);
      setpageCount(totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, itemsPerPage);
  }, []);

  const handlePageClick = (event) => {
    let currentPage = event.selected + 1;
    fetchData(currentPage, itemsPerPage);
  };

  const handleOnclick = (ip) => {
    Swal.fire({
      title: "Do you want to block this USER?",
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
          const response = await axios.post(`http://172.105.47.32:8080/api/blockUser/${paramData.id}`, request, config);
          if (response.data.statusCodeValue === 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'User blocked successfully!',
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

  return (
    <>
      <section className='p-4'>
        <div className="row">
          <div className="col-md-12">
            <h5 className='mb-4'><strong>USER LIST</strong></h5>
            <table className="table table-bordered table-striped">
              <thead style={{ "backgroundColor": "#e7c65d" }}>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">UserID</th>
                  <th scope="col">IP Address</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr className='table-light'>
                      <td colSpan='4'>
                        <div className='text-center'>
                          <div className='spinner-border' role='status' style={{ color: "#009681" }}>
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : userlist && userlist.length > 0 ? (
                    userlist.map((item, index) => {
                      return <tr key={index} className='table-light'>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.ipaddress}</td>
                        <td><button type="button" className="btn btn-danger" onClick={() => handleOnclick(item.ipaddress)}>BLOCK USER</button></td>
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
            {
              userlist && userlist.length > 0 ? (
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
