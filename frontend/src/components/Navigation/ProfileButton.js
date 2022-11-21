import React, { useState, useEffect} from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './Navigation.css';
import { useLocation, useHistory} from "react-router-dom";

const ProfileButton = ({ user, setShowModal, setLogin }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    const location = useLocation();

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
      dispatch(sessionActions.logout())
      .then(() => {
        if (location.pathname === "/hosting") history.push('/')
      })
    };

    return (
      <>
        {user ? (
        <button onClick={openMenu} className='profile-button'>
            <i className="fa-solid fa-bars" id="bars-icon"></i>
            <i className="fa-regular fa-user" id="logged-in-user-icon"></i>
        </button>
        )
        :
        (
        <button onClick={openMenu} className='profile-button'>
            <i className="fa-solid fa-bars" id="bars-icon"></i>
            <i className="fa-regular fa-user" id="not-logged-in-user-icon"></i>
        </button>
        )}
        {showMenu && (user ?
          <div id="logged-in-dropdown">
            <div className="profile-dropdown">
             <div className="login-dropdown-item">
                <div className="login-item">{user.username}</div>
             </div>
             <div className="login-dropdown-item">
              <div className="login-item">{user.email}</div>
             </div>
             <div id="login-linebreak">
              <hr />
             </div>
              <div className="login-dropdown-item" id="manage-listings" onClick={() => history.push('/hosting')}>
                <div className="login-item">
                  Manage listings
                </div>
              </div>
              <div className="login-dropdown-item" id="logout-button" onClick={logout}>
                <div id="logout-box">
                  <div  className="login-item" >Log Out</div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="profile-dropdown">
        <div className="button-holder">
          <li >
            <button
            className="form-button"
            id="signup-button"
            onClick={() => {
              setLogin(false);
              setShowModal(true);
            }}>Sign Up</button>
          </li>
          <li>
            <button
            className="form-button"
            id="login-button"
            onClick={() => {
              setLogin(true);
              setShowModal(true);
            }}>Log in</button>
          </li>
        </div>
        </div>
        )}
      </>
    );
}

export default ProfileButton;
