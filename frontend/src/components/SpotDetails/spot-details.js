import React, { useEffect,  useState } from "react";
import { useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css"
import superhost from "../../images/superhost.png"
import { getSpotById } from "../../store/spots";
import Reviews from "../Reviews";
import Bookings from "../Bookings";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spotById);
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);
    // const [selectEditForm, setSelectEditForm] = useState(0);
    // const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(getSpotById(spotId));
        setLoadAfterSubmit(false);
    }, [spotId, loadAfterSubmit, dispatch])

    if (!spot) return null

    let ratingShaved;
    if(spot.avgRating) {
        ratingShaved = Math.ceil(spot.avgRating)
    }

    // FIND HIGHEST ID AKA MOST RECENTLY ADDED SPOT IMAGE
   let displayImg;
   let highestId = null;
   spot.SpotImages.forEach((img) => {
       if (img.id > highestId) {
           highestId = +img.id

        displayImg = img
    }
   })

    return (
        <>
            <div id="center-container">
                <div id="spot-detail-container">
                    <div id="spot-name">{spot.name}</div>
                    <div className="header-info">
                        ★{ratingShaved} · {spot.numReviews} review{spot.numReviews !== 1 && <p>s </p>}
                         &nbsp; · &nbsp;
                        <img src={superhost} alt="superhost-icon"/> &nbsp; Superhost &nbsp; · &nbsp;
                        <p id="city-country-text">{spot.city}, {spot.country} </p>
                    </div>
                    <div className="img-container">
                        {spot.SpotImages.length > 0 && (
                            <div className="img-preview" key={displayImg.id}>
                                <img src={displayImg.url} alt={displayImg.address} className='spot-img' />
                            </div>
                        )}
                        {spot.SpotImages.length === 0 && (
                            <div className="img-preview">
                                <img src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" alt="img-not-found" className='spot-img' />
                            </div>
                            )
                        }
                    </div>
                    <br />
                    <div className="body-container">
                        <div className="description-container">
                            <div className="description-box">
                                <div id="home-owner-text">
                                    Entire home hosted by {spot.Owner.firstName}
                                </div>
                                <div id="guests-text">
                                    6 guests · 4 bedroom · 4 beds · 3 baths
                                </div>
                            </div>
                            <hr className="hr-line"/>
                            <div className="description-box">
                                <div id="about">
                                    About this space
                                </div>
                                <br />
                                <div id="description-text">
                                {spot.description}
                                </div>
                            </div>
                        </div>

                        <Bookings spot={spot} ratingShaved={ratingShaved} />
                    </div>
                    <hr className="hr-line"/>
                    <div>Calendar goes here</div>
                    <hr className="hr-line"/>
                    <Reviews />
                </div>
            </div>
        </>
    )
}

export default SpotDetails;
