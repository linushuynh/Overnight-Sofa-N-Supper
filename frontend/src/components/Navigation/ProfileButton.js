import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './Navigation.css';

const ProfileButton = ({ user, setShowModal, setLogin }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    useEffect(() => {
      if (!showMenu) return;

      const closeMenu = () => {
        setShowMenu(false);
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
    };

    return (
      <>
        <button onClick={openMenu} className='profile-button'>
          <div >
        <i className="fa-regular fa-user" id="user-icon"></i>
          </div>
        </button>
        {showMenu && (user ?
          <ul className="profile-dropdown">
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
          :
          <ul className="profile-dropdown">
          <li>
            <button onClick={() => {
              setLogin(true);
              setShowModal(true);
            }}>Log In</button>
          </li>
          <li>
            <button onClick={() => {
              setLogin(false);
              setShowModal(true);
            }}>Sign Up</button>
          </li>
        </ul>
        )}
      </>
    );
}

export default ProfileButton;
