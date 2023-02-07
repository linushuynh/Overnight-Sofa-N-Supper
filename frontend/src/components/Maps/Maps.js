import React from "react";
import { useJsApiLoader } from '@react-google-maps/api';
import { useSelector } from "react-redux";
import styles from "./Maps.module.css"

const Maps = ({ apiKey }) => {
    const spot = useSelector(state => state.spots.spotById)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
    });

    return (
        <>
        {isLoaded && (
        <div className={styles.mapContainer}>
            <div className={styles.headerText}>Where you'll be</div>
            <span>{spot.city}, {spot.country}</span>
            <iframe
                title="Map"
                style={{ border: '0', height: '30rem', width: '100%' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${spot.city}${spot.state}`}
            />
        </div>
        )}
        </>
    );
};

export default React.memo(Maps);
