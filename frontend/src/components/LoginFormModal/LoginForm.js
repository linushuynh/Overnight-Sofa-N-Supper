import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginForm.css'

function LoginForm({ setShowModal }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
    .then(() => setShowModal(false))
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
        if (data && data.message) setErrors([data.message]);
      }
    );
  };

  const demoLogin = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }))
    .then(() => setShowModal(false))
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
        if (data && data.message) setErrors([data.message]);
      }
    );
  }


  return (
    <div className="login-box">
      <div id="login-title">Log In</div>
      <hr id="hr" />
      <p id="welcome-tag">Welcome to Overnight S&S</p>
      <form onSubmit={handleSubmit} className="form">
        {errors.length > 0 && (<ul id="list-of-error">
          { errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            ))}
        </ul>)}
             <div id="input-box">
              <label className="input-label">
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                  id="username-input"
                  className="input-bar"
                  placeholder="Username"
                  />
              </label>
              <div>
                <hr id="hr-2"/>
              </div>
              <label className="input-label">

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-bar"
                  id="password-input"
                  placeholder="Password"
                  />
              </label>
                {/* <hr id="hr-2"/> */}
             <button type="submit" id="submit">Log In</button>
             <br />
             <button onClick={demoLogin} id="submit">Demo User</button>
            </div>
      </form>
    </div>
  );
}

export default LoginForm;
