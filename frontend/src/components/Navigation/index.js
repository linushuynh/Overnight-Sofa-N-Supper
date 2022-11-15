import React, { useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import bnbicon from "../../images/bnbicon.png"
import SignupFormPage from '../SignupFormPage';
import { Modal } from "../../context/Modal";
import LoginForm from '../LoginFormModal/LoginForm'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [login, setLogin] = useState(true)

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <ProfileButton user={sessionUser} className="profile-button"/>
  //   );
  // } else {
  //   sessionLinks = (
  //     <>
  //       <LoginFormModal />
  //       <NavLink to="/signup">Sign Up</NavLink>
  //     </>
  //   );
  // }

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
            {isLoaded && (
              <ProfileButton
              user={sessionUser}
              setLogin={setLogin}
              setShowModal={setShowModal}
              />
            )}
            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                { login ? <LoginForm setShowModal={setShowModal} /> : <SignupFormPage setShowModal={setShowModal} />}
              </Modal>
            )}
      </div>
    </div>
    </>

  );
}

export default Navigation;
