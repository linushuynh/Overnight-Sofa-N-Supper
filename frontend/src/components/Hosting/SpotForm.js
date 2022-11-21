import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addImage, createSpot, editSpot } from "../../store/spots";
import "./SpotForm.css"

const SpotForm = ({ setShowModal, actionType, spotId, setLoadAfterSubmit }) => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    // const [lat, setLat] = useState(0);
    // const [lng, setLng] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const [url, setUrl] = useState("")
    // const [preview, setPreview] = useState(true)

    const currentSpotState = useSelector(state => state.spots.userSpots)
    const currentSpot = currentSpotState.find(spot => Number(spot.id) === Number(spotId))

    useEffect(() => {
        if (currentSpot) {
            setAddress(currentSpot.address)
            setCity(currentSpot.city)
            setState(currentSpot.state)
            setCountry(currentSpot.country)
            // setPreview(false)
            // setLat(currentSpot.lat)
            // setLng(currentSpot.lng)
            setName(currentSpot.name)
            setDescription(currentSpot.description)
            setPrice(currentSpot.price)
            setErrors([]);
        }
    }, [currentSpot])

    const handleSubmit = (e) => {
        e.preventDefault();
        let errorValidations = [];

        if (name.length > 20) {
            errorValidations.push("Name of the spot must be under 20 characters")
            setErrors(errorValidations);
            return
        }

        const submitSpot = {
            address, city, state, country, lat: 20, lng: 20, name, description, price
        }
        //For Creating Spots
        if (actionType === "create") {
            dispatch(createSpot(submitSpot))
            .then(() => setShowModal(false))
            .then(() => setLoadAfterSubmit(true))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) errorValidations = [...errorValidations, ...data.errors];
                }
                )

            return
        }
        // For Updating Spots
        if (actionType === "update") {
            // if (currentSpot.previewImage) {
            //     errorValidations.push("There is already an image for this spot! Ability to add multiple images will be added soon")
            //     setErrors(errorValidations)
            //     return
            // }
            submitSpot.id = spotId
            dispatch(editSpot(submitSpot))
            .then(() => setShowModal(false))
            .then(() => setLoadAfterSubmit(true))
            .then(() => {
                if (url !== "") {
                    dispatch(addImage({
                        url,
                        preview: true
                    }, spotId))
                }
            })
            .catch(
                    async (res) => {
                        const data = await res.json();
                        if (data && data.errors) errorValidations.push(data.errors);
                        if (data && data.message) errorValidations.push(data.message);
                    })
                return
            }

            setErrors(errorValidations);
      };

    return (
        <div id="form">
            <div id="header-text">
                {actionType === "create" && "Create Your New Spot"}
                {actionType === "update" && `Edit ${currentSpot.name}`}
            </div>

            <div id="form-container">
                <form className="spot-form" onSubmit={handleSubmit}>
                    {errors.length > 0 && (
                        <ul className="error-list">
                            {errors.length > 0 && errors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                    )}
                    <div id="input-list">

                    <div className="input-container">
                        <input
                        className="input-line"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Address"
                        />
                    </div>
                    <div>
                        <hr className="hr-line"/>
                    </div>
                    <div className="input-container">
                        <input
                        className="input-line"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="City"
                         />
                    </div>
                    <div>
                        <hr className="hr-line"/>
                    </div>
                    <div className="input-container">
                        <input
                        className="input-line"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        placeholder="State"
                         />
                    </div>
                    <div>
                        <hr className="hr-line"/>
                    </div>
                    <div className="input-container">

                        <input
                        className="input-line"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="Country"
                        />
                    </div>
                    {/* <div>
                        Latitude:
                        <input
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        />
                    </div>
                    <div>
                        Longitude:
                        <input
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        />
                    </div> */}
                    <div>
                        <hr className="hr-line"/>
                    </div>
                    <div className="input-container">
                        <input
                        className="input-line"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Display Name"
                        />
                    </div>
                    <div>
                        <hr className="hr-line"/>
                    </div>
                    <div className="input-container">
                        <textarea
                        className="input-line"
                        id="description-input"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Description"
                        />
                    </div>
                    <div>
                        <hr className="hr-line"/>
                    </div>
                    <div className="input-container">
                        <input
                        className="input-line"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        placeholder="Price($) per night"
                        />
                    </div>
                    {actionType === "update" && (
                        <div>
                            <hr className="hr-line"/>
                        </div>
                    )}
                    {actionType === "update" && (
                        <div className="input-container">
                            <input
                            className="input-line"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Add image URL (optional)"
                            />
                            {/* <div>
                            Preview
                            <input type="checkbox" value={preview} onChange={() => setPreview(!preview)}/>
                            </div> */}
                        </div>
                    )}
                </div>
                    <button id="form-submit" type="submit">
                        {actionType === "create" && "Looks Good"}
                        {actionType === "update" && "Confirm"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SpotForm;
