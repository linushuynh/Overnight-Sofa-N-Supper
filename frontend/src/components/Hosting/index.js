import React from "react";
import { useState, useEffect } from "react";
import "./Hosting.css"
import { useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import SpotForm from "./SpotForm";
import { getSpotsOfUser } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { deleteBookingThunk, loadBookingsThunk } from "../../store/booking";
import { convertToWords } from "../../utils/date-management";

const Hosting = () => {
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [createFormMode, setCreateFormMode] = useState(true);
    const dispatch = useDispatch()
    const userSpots = useSelector((state) => state.spots.userSpots);
    const [selectSpotEdit, setSelectSpotEdit] = useState("");
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);
    const currentUser = useSelector(state => state.session.user)
    const bookings = useSelector(state => state.bookingState.bookingsList)

    useEffect(() => {
        dispatch(loadBookingsThunk())
        dispatch(getSpotsOfUser())
        setLoadAfterSubmit(false)
    }, [dispatch, loadAfterSubmit])

    // Opens listener when menu opens and closes listener to menu closes
    useEffect(() => {
        if (!showMenu) return;
        const closeMenu = () => {
            setShowMenu(false);
        };
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const handleDeleteSpot = async (e, spotId) => {
        e.preventDefault();
        await dispatch(deleteSpot(spotId));
        setLoadAfterSubmit(true)
    }

    const handleDeleteBooking = async (e, bookingId) => {
        e.preventDefault();
        await dispatch(deleteBookingThunk(bookingId))
        setLoadAfterSubmit(true)
    }

    if (!userSpots) return null
    if (!currentUser) history.push('/')

    return (
        <>
            <div className="hosting-box">
                <div id="welcome-user-box">
                    <div>Welcome to your dashboard! </div>
                </div>

                <hr style={{ marginTop: '1rem', marginBottom: "2rem" }} />

                <div id="create-listing-box">
                    {!showMenu && (
                        <button
                        id="create-button"
                        onClick={() => {
                            setCreateFormMode(true)
                            setShowModal(true)
                        }}>
                            Create a new listing
                        </button>
                    )}
                </div>

                {showModal && createFormMode && (
                    <Modal onClose={() => {
                        setShowModal(false)
                    }}>
                    <SpotForm setShowModal={setShowModal} actionType="create" setLoadAfterSubmit={setLoadAfterSubmit} />
                </Modal>
                 )}

                <div id="your-listings-text">
                    Your Listings
                </div>

                <div id="listings-box">
                    {userSpots.map(spot => (
                        <div key={spot.id} className="user-spot-div">
                            <div className="spot-name-text" onClick={() => history.push(`/spots/${spot.id}`)}>
                                {spot.name}
                                </div>
                            <div>
                                <button
                                    className="buttons"
                                    onClick={() => {
                                        setCreateFormMode(false)
                                        setShowModal(true)
                                        setSelectSpotEdit(spot.id)
                                    }}>
                                        Edit {spot.name}
                                    </button>
                                    <button
                                    className="buttons"
                                    onClick={(e) => {
                                        handleDeleteSpot(e, spot.id)
                                    }}>
                                        Delete {spot.name}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && !createFormMode && (
                    <Modal onClose={() => {
                        setLoadAfterSubmit(true)
                        setShowModal(false)
                    }}>
                    <SpotForm setShowModal={setShowModal} actionType="update" spotId={selectSpotEdit} setLoadAfterSubmit={setLoadAfterSubmit}/>
                </Modal>
                )}


                <div id="your-listings-text">
                    Your Bookings
                </div>

                <div className="bookings-container">
                    {bookings.length > 0 ? (bookings?.map(booking => (
                        <div key={booking.id} className='booking-card'>
                            <div className="booking-info">
                                {booking?.Spot.address} · {booking?.Spot.city}, {booking?.Spot.state}
                            </div>
                            <div className="booking-img-container">
                                {booking?.Spot.previewImage && (
                                    <img alt="bookingPreview" src={booking?.Spot.previewImage} />
                                )}
                            </div>
                            <div className="dates-container">
                                <span>{convertToWords(booking?.startDate)}</span> to <span>{convertToWords(booking?.endDate)}</span>
                            </div>
                            <div>
                                <button className="action-buttons" onClick={(e) => handleDeleteBooking(e, booking.id)}>Cancel this booking</button>
                            </div>
                        </div>
                    ))): (
                        <div>
                            No bookings found... Make a booking reservation!
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Hosting;
