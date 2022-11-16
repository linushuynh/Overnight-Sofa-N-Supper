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
                <button onClick={() => setShowModal(true)}>
                    Create a new listing
                </button>

            )}
            {showModal && (
            <Modal onClose={() => setShowModal(false)}>
                <SpotForm setShowModal={setShowModal}/>
            </Modal>
      )}
        </div>
    )
}

export default Hosting;
