import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css"
import { getSpotById } from "../../store/spots";
import { createReview, loadReviews } from "../../store/review";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.spotById);
    const reviews = useSelector((state) => state.reviewState.reviews)
    const history = useHistory();
    const [showReviewMenu, setShowReviewMenu] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState(0);
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false)

    const openReviewMenu = () => {
        if (showReviewMenu) return
        setShowReviewMenu(true)
    }

    const closeReviewMenu = () => {
        if (!showReviewMenu) return;
         setShowReviewMenu(false);
    };

    useEffect(() => {
        dispatch(getSpotById(spotId));
        dispatch(loadReviews(spotId));
        setLoadAfterSubmit(false);
    }, [spotId, loadAfterSubmit, dispatch])

    const submitReview = (e) => {
        e.preventDefault();

        dispatch(createReview({
            review: reviewText,
            stars
        }, spotId))
        setLoadAfterSubmit(true)
    }

    if (!spot) return null
    if (!reviews) return null

    return (
        <>
            <div id="center-container">
                <div id="spot-detail-container">
                    <p id="spot-name">{spot.name}</p>
                    <p>{spot.city}, {spot.country}</p>
                    {spot.SpotImages.map((spotImg) => (
                        <div className="img-container" key={spotImg.id}>
                            <img src={spotImg.url} alt={spotImg.address} className='spot-img' />
                        </div>
                    ))}
                    <p>{spot.description}</p>
                    <div id="avgRating">
                        <p>★{spot.avgRating} · {spot.numReviews} reviews</p>
                    </div>
                    {reviews.map((review) => (
                        <div className="review-item" key={review.id}>
                            <div>{review.User.firstName} {review.User.lastName}</div>
                            <div>{review.createdAt}</div>
                            {review.review}
                        </div>
                    ))}
                    <br />
                    <div id="create-review-box">
                        {!showReviewMenu ? (
                            <button onClick={openReviewMenu}>Create a new review</button>
                            )
                            :
                            (<div>
                        <button onClick={closeReviewMenu}>Cancel review</button>
                        <form onSubmit={submitReview} id="review-form">
                            <label>
                                <br />
                                <textarea
                                onChange={(e) => setReviewText(e.target.value) }
                                value={reviewText}
                                placeholder="Tell us your thoughts"
                                />
                            </label>
                            <br />
                            <label>
                                Stars:
                                <input
                                type="number"
                                min="0"
                                max="5"
                                placeholder="0-5★"
                                onChange={(e) => setStars(e.target.value)}
                                value={stars}
                                />
                            </label>
                            <br />
                            <button type="submit">Submit review</button>
                        </form>
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SpotDetails;
