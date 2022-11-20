import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css"
import superhost from "../../images/superhost.png"
import { getSpotById } from "../../store/spots";
import { createReview, deleteReview, editReview, loadReviews } from "../../store/review";
import { Modal } from "../../context/Modal";

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.spotById);
    const reviews = useSelector((state) => state.reviewState.reviews)
    const history = useHistory();
    const [showReviewMenu, setShowReviewMenu] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState(0);
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);
    const [errors, setErrors] = useState([]);
    const [selectEditForm, setSelectEditForm] = useState(0);
    const currentUser = useSelector(state => state.session.user)
    // const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setErrors([]);
    }, [spotId, loadAfterSubmit, dispatch])

    const submitReview = (e) => {
        e.preventDefault();

        dispatch(createReview({
            review: reviewText,
            stars
        }, spotId));

        setReviewText("");
        setStars(0);
        setErrors([]);
        closeReviewMenu();
        setLoadAfterSubmit(true);
    }

    const clickDeleteReview = (e, reviewId) => {
        e.preventDefault();

        dispatch(deleteReview(reviewId))
        setErrors([]);
        setReviewText("")
        setStars(0);
        setShowReviewMenu(false);
        setLoadAfterSubmit(true);
    }

    const clickEditReview = (e, reviewId) => {
        e.preventDefault();
        const errorValidations = []

        dispatch(editReview({
            review: reviewText,
            stars
        }, reviewId))
        .catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) errorValidations.push(data.errors);
            }
            )

        setErrors([errorValidations]);
        setReviewText("")
        setStars(0);
        setShowEditForm(false)
        setLoadAfterSubmit(true);
    }

    const translateToDate = (createdAt) => {
        const formattedDate = createdAt.slice(0, 10);
        return formattedDate
    }

    const checkReviewOwner = (userId) => {
        return currentUser.id !== userId
    }

    if (!spot) return null

    return (
        <>
            <div id="center-container">
                <div id="spot-detail-container">
                    <div id="spot-name">{spot.name}</div>
                    <div className="header-info">
                        ★{spot.avgRating} · {spot.numReviews} review{spot.numReviews !== 1 && <p>s </p>}
                         &nbsp; · &nbsp;
                        <img src={superhost} /> &nbsp; Superhost &nbsp; · &nbsp;
                        <p id="city-country-text">{spot.city}, {spot.country} </p>
                    </div>
                    <div className="img-container">
                        {spot.SpotImages.map((spotImg) => (
                            <div className="img-preview" key={spotImg.id}>
                                <img src={spotImg.url} alt={spotImg.address} className='spot-img' />
                            </div>
                        ))}
                    </div>

                    <br />

                    <div className="description-box">{spot.description}</div>
                    <div id="avgRating">
                        <p>★{spot.avgRating} · {spot.numReviews} review(s)</p>
                    </div>

                    <ul>
                        {errors.map((error, idx) => (
                         <li key={idx}>{error}</li>
                        ))}
                    </ul>

                    {reviews.map((review) => (
                        <div className="review-item" key={review.id}>
                            <div>{review.User.firstName} {review.User.lastName}</div>
                            <div>{translateToDate(review.createdAt)}</div>
                            {review.review}
                            {/* { selectEditForm === review.id && showEditForm ? (
                                (
                                    <div className="edit-container">
                                        <button className="edit-button" onClick={() => {
                                            if (!showEditForm) return
                                            setSelectEditForm("");
                                            setShowEditForm(false);
                                            setReviewText("");
                                            setStars(0);
                                        }}>
                                            Cancel Edit
                                        </button>
                                        <form onSubmit={(e) => clickEditReview(e, review.id)}>
                                            <label>
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
                                            <button type="submit">Submit Edit</button>
                                        </form>
                                    </div>
                                )
                            )
                            :
                            (
                                <div className="edit-container">
                                <button className="edit-button" onClick={() => {
                                    if (showEditForm) return
                                    if (checkReviewOwner(review.userId)) {
                                        return setErrors([...errors, "This is not your review to edit!"])
                                    }
                                    setSelectEditForm(review.id)
                                    setShowEditForm(true)
                                    setReviewText(review.review);
                                    console.log("reviewText*******",reviewText)
                                    setStars(review.stars);
                                    console.log("stars*******",stars)
                                }}>Edit</button>
                            </div>
                            )} */}
                            <br />
                            { (currentUser.id == review.userId) && (<div id="delete-button-container">
                                 <button onClick={(e) => {
                                    if (checkReviewOwner(review.userId)) return setErrors([...errors, "This is not your review to delete!"])
                                    clickDeleteReview(e, review.id)
                                    }}>Delete review</button>
                            </div>)}

                            <br />
                        </div>
                    ))}
                    <br />
                    {currentUser && (<div id="create-review-box">
                        {!showReviewMenu ? (
                            <button onClick={openReviewMenu}>Create a new review</button>
                            )
                            :
                            (<div>
                        <button onClick={closeReviewMenu}>Cancel review</button>
                        <form onSubmit={submitReview} id="review-menu">
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
                    </div>)}

                </div>
            </div>
        </>
    )
}

export default SpotDetails;
