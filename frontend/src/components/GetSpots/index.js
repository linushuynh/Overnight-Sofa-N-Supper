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
                <div key={spot.id} className="spot-box" >
                   {spot.previewImage && (<img src={spot.previewImage} alt="" className="spot-image" onClick={() => history.push(`/spots/${spot.id}`)} />)}
                   {!spot.previewImage && (<img src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" alt="" className="spot-image" onClick={() => history.push(`/spots/${spot.id}`)} />)}
                   <div id="spot-header" onClick={() => history.push(`/spots/${spot.id}`)}>
                        <p className="spot-name">{spot.name}</p>
                        <p className="spot-info" id="rating">★ {spot.avgRating? spot.avgRating : "New"}</p>
                    </div>
                    <div id="middle-text" onClick={() => history.push(`/spots/${spot.id}`)}>
                        <p className="spot-info" id="spot-location">{spot.city}, {spot.country}</p>

                    </div>
                    <div id="spot-details" onClick={() => history.push(`/spots/${spot.id}`)}>
                         <p className="spot-info" id="spot-price">${spot.price}</p>
                         <p className="spot-info" id="night-text"> night</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GetSpots;
