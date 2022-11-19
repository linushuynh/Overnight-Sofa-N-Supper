import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addImage, createSpot, editSpot } from "../../store/spots";

const SpotForm = ({ setShowModal, actionType, spotId, setLoadAfterSubmit }) => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const dispatch = useDispatch();
    const [url, setUrl] = useState("")
    const [preview, setPreview] = useState(false)

    const currentSpotState = useSelector(state => state.spots.userSpots)
    const currentSpot = currentSpotState.find(spot => Number(spot.id) === Number(spotId))

    useEffect(() => {
        if (currentSpot) {
            setAddress(currentSpot.address)
            setCity(currentSpot.city)
            setState(currentSpot.state)
            setCountry(currentSpot.country)
            setLat(currentSpot.lat)
            setLng(currentSpot.lng)
            setName(currentSpot.name)
            setDescription(currentSpot.description)
            setPrice(currentSpot.price)
            setErrors([]);
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorValidations = [];
        const submitSpot = {
            address, city, state, country, lat, lng, name, description, price
        }
        //For Creating Spots
        if (actionType === "create") {
            dispatch(createSpot(submitSpot))
            .then(() => setShowModal(false))
            .then(() => setLoadAfterSubmit(true))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) errorValidations.push(data.errors);
                    if (data && data.message) errorValidations.push(data.message);
                }
                )
            if (url !== "") {
               dispatch(addImage({
                url,
                preview
               }, spotId),)
            }
            return
        }
        // For Updating Spots
        if (actionType === "update") {
            submitSpot.id = spotId
            dispatch(editSpot(submitSpot))
            .then(() => setShowModal(false))
            .then(() => setLoadAfterSubmit(true))
            .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data && data.errors) errorValidations.push(data.errors);
                        if (data && data.message) errorValidations.push(data.message);
                    }
                    )
            if (url !== "") {
                dispatch(addImage({
                    url,
                    preview
                }, spotId))
            }
                return
            }

            setErrors(errorValidations);
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
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Add image:
                    <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Please put valid link"
                     />
                    <input type="checkbox" value={preview} onChange={() => setPreview(!preview)}/>
                </label>
                <button id="form-submit" type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SpotForm;
