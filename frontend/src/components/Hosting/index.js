import React from "react";
import { useState, useEffect } from "react";
import "./Hosting.css"
import { useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import SpotForm from "./SpotForm";

const Hosting = () => {
    const [showMenu, setShowMenu] = useState(false);
    // const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [createFormMode, setCreateFormMode] = useState(true);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
      };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);


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
            <Modal onClose={() => setShowModal(false)}>
                <SpotForm setShowModal={setShowModal} actionType="create" />
            </Modal>
             )}

            <div> Show listings here</div>

                <button onClick={() => {
                    setCreateFormMode(false)
                    setShowModal(true)
                    }}>
                    Edit a current listing(Append this to each listing item)
                </button>

            {showModal && !createFormMode && (
            <Modal onClose={() => setShowModal(false)}>
                <SpotForm setShowModal={setShowModal} actionType="update" />
            </Modal>
             )}
        </div>
    )
}

export default Hosting;
