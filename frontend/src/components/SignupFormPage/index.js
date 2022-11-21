import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormPage({ setShowModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorsArr = []
    if (firstName.slice(0,1) !== firstName.slice(0,1).toUpperCase()) {
      errorsArr.push('The first name must be capitalized')
    }
    if (lastName.slice(0,1) !== lastName.slice(0,1).toUpperCase()) {
      errorsArr.push('The last name must be capitalized')
    }
    if (password !== confirmPassword) {
      errorsArr.push('Confirm Password field must be the same as the Password field')
    }

    if (errorsArr.length > 0) {
      return setErrors(errorsArr);
    } else {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password,firstName, lastName }))
        .then(() => setShowModal(false))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }

  };

  return (
    <div id="signup-form-modal">
      <div id="signup-header">
        Sign Up
      </div>

      <hr className="hr-signup-bar" />

      <div id="signup-welcome">
        <div>
          Welcome to Overnight S&S
        </div>
      </div>

      <div id="signup-form-container">
        <form id="signup-form" onSubmit={handleSubmit}>
          {errors.length > 0 && (<ul className="error-list">
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>)}

          <div id="signup-input-list">
            <label className="signup-input-container">
              <input
                className="signup-input-bar"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </label>

            <div>
              <hr className="hr-signup-bar" />
            </div>

            <label className="signup-input-container">
              <input
                className="signup-input-bar"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />
            </label>

            <div>
              <hr className="hr-signup-bar" />
            </div>

            <label className="signup-input-container">
              <input
                className="signup-input-bar"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
              />
            </label>

            <div>
              <hr className="hr-signup-bar" />
            </div>

            <label className="signup-input-container">
              <input
                className="signup-input-bar"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
              />
            </label>

            <div>
              <hr className="hr-signup-bar" />
            </div>

            <label className="signup-input-container">
              <input
                className="signup-input-bar"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </label>

            <div>
              <hr className="hr-signup-bar" />
            </div>

            <label className="signup-input-container">
              <input
                className="signup-input-bar"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
              />
            </label>

          </div>
            <div>
              <button className="buttons" id="signup-submit-button" type="submit">Sign Up</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
