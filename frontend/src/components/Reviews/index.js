import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { createReview, deleteReview, loadReviews } from "../../store/review";

function Reviews () {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const currentUser = useSelector(state =>  state.session.user)
    const reviews = useSelector(state => state.reviewState.reviews)
    const spot = useSelector(state => state.spots.spotById);
    const [showReviewMenu, setShowReviewMenu] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState("");
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);
    const [errors, setErrors] = useState([])
    const reviewRef = useRef(null)

    // When creating a review, re-render will scroll to the textbox off page
    useEffect(() => {
        reviewRef.current?.focus()
        reviewRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [reviewRef, showReviewMenu])

    useEffect(() => {
        setErrors([])
        dispatch(loadReviews(spotId))
    }, [loadAfterSubmit, dispatch, spotId])

    const openReviewMenu = () => {
        if (showReviewMenu) return
        setShowReviewMenu(true)
    }

    const closeReviewMenu = () => {
        if (!showReviewMenu) return;
        setReviewText("")
        setStars("")
        setShowReviewMenu(false);
    };

    // CREATE REVIEW
    const submitReview = (e) => {
        e.preventDefault();
        dispatch(createReview({
            review: reviewText,
            stars
        }, spotId))
        .then(() => {
            setReviewText("")
            setStars(0)
            setErrors([])
            closeReviewMenu()
            setLoadAfterSubmit(true)
        })
        .catch(
            async (res) => {
              const data = await res.json();
              if (data && data.message) setErrors([...errors, data.message])
              if (data && data.errors) setErrors([...errors, ...data.errors]);
            }
          );
    }

    // DELETE REVIEW
    const clickDeleteReview = (e, reviewId) => {
        e.preventDefault();
        dispatch(deleteReview(reviewId))
        .then(() => {
            setErrors([]);
            setReviewText("")
            setStars("");
            setShowReviewMenu(false);
            setLoadAfterSubmit(true);
        })
        .catch(
            async (res) => {
              const data = await res.json();
              if (data && data.errors) setErrors(...errors, data.errors);
            }
          );
    }

    // const clickEditReview = (e, reviewId) => {
    //     e.preventDefault();
    //     const errorValidations = []

    //     dispatch(editReview({
    //         review: reviewText,
    //         stars
    //     }, reviewId))
    //     .catch(
    //         async (res) => {
    //             const data = await res.json();
    //             if (data && data.errors) errorValidations.push(data.errors);
    //         }
    //         )

    //     setErrors([errorValidations]);
    //     setReviewText("")
    //     setStars("");
    //     // setShowEditForm(false)
    //     setLoadAfterSubmit(true);
    // }

    let ratingShaved;
    if(spot.avgRating) {
        ratingShaved = Math.ceil(spot.avgRating)
    }

    const translateToDate = (createdAt) => {
        const formattedDate = createdAt.slice(0, 10);
        return formattedDate
    }

    const checkReviewOwner = (userId) => {
        return currentUser.id !== userId
    }

    return (
        <div className="review-container">
            <div id="avgRating">
                ★{ratingShaved} · {spot.numReviews} review{spot.numReviews !== 1 && "s"}
            </div>

            {errors.length > 0 && (<ul className="error-list">
                {errors.map((error, idx) => (
                 <li key={idx}>{error}</li>
                ))}
            </ul>)}

            {currentUser && (<div id="create-review-box">
                    {!showReviewMenu ? (
                        <button className="action-buttons" onClick={openReviewMenu}>Create a new review</button>
                        )
                        :
                        (<div>
                    <button className="action-buttons" onClick={closeReviewMenu}>Cancel review</button>
                    <form onSubmit={submitReview} id="review-menu">
                        <label>
                            <br />
                            <textarea
                            id="review-input"
                            onChange={(e) => setReviewText(e.target.value) }
                            value={reviewText}
                            placeholder="Tell us your thoughts about this place!"
                            required
                            ref={reviewRef}
                            maxLength={255}
                            />
                        </label>
                        <div>{reviewText.length}/255 characters</div>
                        <br />
                        <label>
                            Stars: &nbsp;
                            <input
                            id="star-input"
                            type="number"
                            min="1.0"
                            max="5.0"
                            placeholder="1-5★"
                            onChange={(e) => setStars(e.target.value)}
                            value={stars}
                            required
                            />
                        </label>
                        <br />
                        <button className="action-buttons" type="submit">Submit review</button>
                    </form>
                    </div>)}
                </div>)}

            <br />

            <div id="reviews-box">
                {reviews.map((review) => (
                    <div className="review-item" key={review.id}>
                        <div className="review-info" id="reviewer-text">{review.User.firstName} {review.User.lastName}</div>
                        <div className="review-info" id="star-date">
                            <div className="review-info" id="review-date">{translateToDate(review.createdAt)} </div>
                            <div className="review-info" id="star-text">★{review.stars}</div>
                        </div>
                        <div className="review-info" id="review-description">{review.review}</div>


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
                        {currentUser && (currentUser.id === review.userId) && (<div id="delete-button-container">
                             <button
                             className="action-buttons"
                             onClick={(e) => {
                                if (checkReviewOwner(review.userId)) return setErrors([...errors, "This is not your review to delete!"])
                                clickDeleteReview(e, review.id)
                                }}>Delete review</button>
                        </div>)}

                        <br />
                    </div>
                ))}
            </div>
            <hr className="hr-line"/>

        </div>
    )
}

export default Reviews
