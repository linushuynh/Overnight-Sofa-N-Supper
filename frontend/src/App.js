import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetSpots from "./components/GetSpots";
import SpotDetails from "./components/SpotDetails/spot-details";
import Hosting from "./components/Hosting";
import './index.css'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div id="bar">
        <hr className="screen-bar"/>
      </div>
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <GetSpots />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/hosting">
            <Hosting />
          </Route>
        </Switch>
      )}
      <Navigation isLoaded={isLoaded} />
    </>
  );
}

export default App;
