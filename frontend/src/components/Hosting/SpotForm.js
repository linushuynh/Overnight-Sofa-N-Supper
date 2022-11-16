import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";

const SpotForm = ({ setShowModal, actionType }) => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        
        return dispatch(createSpot({
            address, city, state, country, lat, lng, name, description, price
        }))
        .then(() => setShowModal(false))
        .catch(
          async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          }
        );
      };

    return (
        <div>
            <form className="spot-form" onSubmit={handleSubmit}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
             </ul>
                <label>
                    Address:
                    <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    />
                </label>
                <label>
                    City:
                    <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                     />
                </label>
                <label>
                    State:
                    <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                     />
                </label>
                <label>
                    Country:
                    <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Latitude:
                    <input
                    type="number"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    />
                </label>
                <label>
                    Longitude:
                    <input
                    type="number"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    />
                </label>
                <label>
                    Name:
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Description:
                    <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Price:
                    <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    />
                </label>
                <button id="form-submit" type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SpotForm;
