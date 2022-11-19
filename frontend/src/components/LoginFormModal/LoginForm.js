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
      }
    );
  };

  return (
    <div className="login-box">
      <div id="login-title">Log In</div>
      <hr id="hr" />
      <p id="welcome-tag">Welcome to Overnight S&S</p>
      <form onSubmit={handleSubmit} className="form">
        <ul id="list-of-input">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            ))}
        </ul>
        <label className="input-label">

          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            id="username-input"
            placeholder="Username"
            />
        </label>
        <hr />
        <label className="input-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="password-input"
            />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginForm;
