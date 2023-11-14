import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoutes(props) {

    const navigate = useNavigate();

    const{Component} = props

    useEffect(() => {
        const login=localStorage.getItem('token');
        if(!login) {
            navigate("/");
        }
    }, [])
    
  return (
    <>
        <Component/>
    </>
  )
}
