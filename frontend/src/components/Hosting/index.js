import React from "react";
import { useState, useEffect } from "react";
import "./Hosting.css"
import { useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import SpotForm from "./SpotForm";
import { getSpotsOfUser } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { loadBookingsThunk } from "../../store/booking";
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
    const bookings = useSelector(state => state.bookingState.bookings.Bookings)
    console.log(bookings)

    useEffect(() => {
        dispatch(loadBookingsThunk())
        dispatch(getSpotsOfUser())
        setLoadAfterSubmit(false)
    }, [dispatch, loadAfterSubmit])

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const handleDelete = (e, spotId) => {
        e.preventDefault();
        dispatch(deleteSpot(spotId));
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

                <br />
                <hr />
                <br />
                {/* <button className="listing-menu" onClick={openMenu}>
                    Menu
                </button> */}
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

                <br />

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
                                        handleDelete(e, spot.id)
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

                <br />

                <div id="your-listings-text">
                    Your Bookings
                </div>
                <br />
                <div className="bookings-container">
                    {bookings?.map(booking => (
                        <div key={booking.id} className='booking-card'>
                            <div className="booking-info">
                                {booking?.Spot.address} {booking?.Spot.city} , {booking?.Spot.state}
                            </div>
                            <div className="booking-img-container">
                                {booking?.Spot.previewImage && (
                                    <img alt="bookingPreview" src={booking?.Spot.previewImage} />
                                )}
                            </div>
                            <div className="dates-container">
                                {convertToWords(booking?.startDate)} to {convertToWords(booking?.endDate)}
                            </div>
                            <div>
                                <button className="action-buttons">Delete this booking</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Hosting;
