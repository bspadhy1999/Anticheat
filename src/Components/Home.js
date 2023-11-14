import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home() {

  const [websites, setWebsites] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        };
        const response = await axios.get("http://172.105.47.32:8080/api/website/list", config);
        setWebsites(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const seeIP = (id) => {
    navigate(`/iplist/${id}`);
  }

  return (
    <>
      <section className='p-4'>
        <div className="row">
          <div className="col-md-12">
            <h4 className='mb-4'><strong>ACTIVE WEBSITES</strong></h4>
            <table className="table table-bordered table-striped">
              <thead style={{ "backgroundColor": "#e7c65d" }}>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">Website Name</th>
                  <th scope="col">Website URL</th>
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
                  ) : websites && websites.length > 0 ? (
                    websites.map((item, index) => {
                      return <tr key={index} className='table-light'>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.url}</td>
                        <td><button type="button" className="btn btn-success" onClick={() => seeIP(item.id)}>SEE IP</button></td>
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
