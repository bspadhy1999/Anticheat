import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import Websites from './Components/Websites';
import UserSetting from './Components/UserSetting';
import Header from './Components/Header';
import Iplist from './Components/Iplist';
import BlockedIplist from './Components/BlockedIplist';
import Userlist from './Components/Userlist';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <>
      <BrowserRouter>
          <Header/>
        <Routes>
          <Route exact path='/' element={<Login/>} />
          <Route exact path='/home' element={<ProtectedRoute Component={Home} />} />
          <Route exact path='/websites' element={<ProtectedRoute Component={Websites} />} />
          <Route exact path='/user-setting' element={<ProtectedRoute Component={UserSetting} />} />
          <Route exact path='/iplist/:id' element={<ProtectedRoute Component={Iplist} />} />
          <Route exact path='/blocked-iplist/:id' element={<ProtectedRoute Component={BlockedIplist} />} />
          <Route exact path='/userlist/:id/:ip' element={<ProtectedRoute Component={Userlist} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
