import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css"
import { getSpotById } from "../../store/spots";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.spotById);
    const history = useHistory();

    useEffect(() => {
        dispatch(getSpotById(spotId));
    }, [spotId, dispatch])

    if (!spot) return null

    return (
        <>
            <div className="spot-detail-container">
                {spot.SpotImages.map((spotImg) => (
                    <img src={spotImg.url} alt={spotImg.address} key={spotImg.id} className='spot-img' />
                ))}
                <p>{spot.name}</p>
            </div>
        </>
    )
}

export default SpotDetails;
