import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import bnbicon from "../../images/bnbicon.png"

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
    <>
    <div className='navbar'>
      <div className='iconContainer'>
        <img src={bnbicon} alt="Logo" className='icon' />
        <NavLink exact to="/" className='overnightsns'> Overnight S&S </NavLink>
      </div>
        <hr />
      <div className='bookingBox'>
        <p> Anywhere Any week Add guests </p>

      </div>
        <hr />
      <div className='userBox'>
            {isLoaded && sessionLinks}
      </div>
    </div>
    </>

  );
}

export default Navigation;
