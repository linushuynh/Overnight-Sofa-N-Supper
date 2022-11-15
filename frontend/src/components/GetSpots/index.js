import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpots, setSpots } from "../../store/spots"
import './Spots.css';

function GetSpots() {
    const allSpots = useSelector(state => state.spots.Spots);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch]);

    if (!allSpots) return null

    return (
        <div className="spots-container">
            {allSpots.map((spot) => (
                <div key={spot.id} className="spot-box">
                    <img src={spot.previewImage} className="spot-image" />
                    <p className="spot-info" id="spot-location">{spot.city}, {spot.country}</p>
                    <p className="spot-info" id="spot-price">${spot.price} night</p>
                </div>
            ))}
        </div>
    )
}

export default GetSpots;
