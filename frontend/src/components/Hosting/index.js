import React from "react";
import { useState, useEffect } from "react";
import "./Hosting.css"
import { useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import SpotForm from "./SpotForm";
import { getSpotsOfUser } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { deleteSpot } from "../../store/spots";

const Hosting = () => {
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [createFormMode, setCreateFormMode] = useState(true);
    const dispatch = useDispatch()
    const userSpots = useSelector((state) => state.spots.userSpots);
    const [selectSpotEdit, setSelectSpotEdit] = useState("");
    const [loadAfterSubmit, setLoadAfterSubmit] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
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

    return (
        <div className="hosting-box">
            <button className="listing-menu" onClick={openMenu}>
                Menu
            </button>

            {showMenu && (
                <button onClick={() => {
                    setCreateFormMode(true)
                    setShowModal(true)
                    }}>
                    Create a new listing
                </button>

            )}
            {showModal && createFormMode && (
            <Modal onClose={() => {
                setShowModal(false)
                }}>
                <SpotForm setShowModal={setShowModal} actionType="create" setLoadAfterSubmit={setLoadAfterSubmit} />
            </Modal>
             )}

            <div id="listings-box"> Show listings here
                {userSpots.map(spot => (
                    <div key={spot.id} className="user-spot-div">
                        {spot.name}
                        <button
                        className="edit-button"
                        onClick={() => {
                            setCreateFormMode(false)
                            setShowModal(true)
                            setSelectSpotEdit(spot.id)
                            }}>
                            Edit {spot.name}
                        </button>
                        <button
                        className="delete-button"
                        onClick={(e) => {
                            handleDelete(e, spot.id)
                        }}>
                            Delete {spot.name}
                        </button>
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
        </div>
    )
}

export default Hosting;
