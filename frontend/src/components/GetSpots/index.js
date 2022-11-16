import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpots} from "../../store/spots"
import './Spots.css';
import { useHistory } from "react-router-dom"

function GetSpots() {
    const allSpots = useSelector(state => state.spots.Spots);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch]);

    if (!allSpots) return null

    return (
        <div className="spots-container">
            {allSpots.map((spot) => (
                <div key={spot.id} className="spot-box" onClick={() => history.push(`/spots/${spot.id}`)}>
                   {spot.previewImage && (<img src={spot.previewImage} alt="" className="spot-image" />)}
                    <p className="spot-info" id="spot-location">{spot.city}, {spot.country}</p>
                    <p className="spot-info" id="spot-price">${spot.price} night</p>
                </div>
            ))}
        </div>
    )
}

export default GetSpots;
