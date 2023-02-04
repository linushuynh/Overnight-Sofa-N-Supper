import React, { useEffect,  useState } from "react";
import { useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css"
import superhost from "../../images/superhost.png"
import { getSpotById } from "../../store/spots";
import Reviews from "../Reviews";
import Bookings from "../Bookings";
import MapContainer from "../Maps";
import github from "../../images/github.svg"
import linkedIn from "../../images/linkedin.svg"
import { shaveRating } from "../../utils/calc-functions";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spotById);
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);

    useEffect(() => {
        dispatch(getSpotById(spotId));
        setLoadAfterSubmit(false);
    }, [spotId, loadAfterSubmit, dispatch])

    if (!spot) return null

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
                        ★{shaveRating(spot?.avgRating)} · {spot.numReviews} review{spot.numReviews !== 1 && <p>s </p>}
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

                        <Bookings spot={spot} />
                    </div>
                    {/* <hr className="hr-line"/>
                    <div>Calendar goes here</div> */}
                    <hr className="hr-line"/>
                    <Reviews />
                    <MapContainer />
                </div>
            </div>

            <section id='spot-detail-footer'>
                <div className='footer-info-container'>
                    <span>2023 Overnight S&S</span>
                    <div>
                        <div>
                        Developed by Linus Huynh
                        </div>
                        <div style={{ display: 'flex', justifyContent: "flex-end", gap: "0.5rem" }}>
                        <a className='git-container'
                            href="https://github.com/linushuynh"
                            target="_blank"
                            rel="noreferrer"
                            >
                                <img
                                className='github-img'
                                src={github}
                                alt="github-icon"
                                />
                            </a>
                            <a className='linkedin-container'
                                href="https://www.linkedin.com/in/linus-huynh/"
                                target="_blank"
                                rel="noreferrer"
                                >
                                    <img
                                        src={linkedIn}
                                        alt="linkedIn-icon"
                                        className='linkedin-img'
                                        />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SpotDetails;
