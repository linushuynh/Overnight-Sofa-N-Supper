import { useState } from 'react';
import styles from './Bookings.module.css'

function Bookings({ spot, ratingShaved }) {
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    console.log(spot)
    return (
        <div className={styles.bookingsContainer}>
            <div className={styles.headerContainer}>
                {/* <div style={{ display: "flex", alignItems: "center" }} > */}
                    <div className={styles.price}>${spot.price} <span>night</span></div>
                    <div className={styles.reviewInfo}>★{ratingShaved} · {spot.numReviews} reviews</div>
                {/* </div> */}
            </div>
            <div className={styles.formContainer}>
                <form>
                    <div className={styles.inputContainer}>
                        <input
                            type="date"
                            className={styles.startDateInput}
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                            >
                        </input>
                        <hr />
                        <input
                            type="date"
                            className={styles.endDateInput}
                            onChange={(e) => setEndDate(e.target.value)}
                            value={endDate}
                            >
                        </input>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type='submit'>
                            Reserve
                        </button>
                    </div>
                </form>
            </div>
            <div style={{ fontWeight: "300", fontSize: "12px" }}>
                You won't be charged yet
            </div>
            <div className={styles.calcContainer}>
                <div className={styles.calcDiv}>
                    <div className={styles.calcText}>
                        {spot.price} x (num) nights
                    </div>
                    <div>

                    </div>
                </div>
                <div className={styles.calcDiv}>
                    <div className={styles.calcText}>
                        Cleaning fee
                    </div>
                    <div>
                    ${Math.ceil(spot.price*0.15)}
                    </div>
                </div>
                <div className={styles.calcDiv}>
                    <div className={styles.calcText}>
                        Service fee
                    </div>
                    <div>
                        ${Math.ceil(spot.price*0.2)}
                    </div>
                </div>
            </div>
            <hr style={{ width: "85%", opacity: "45%" }} />
            <div className={styles.totalContainer}>
                <div>
                    Total before taxes
                </div>
                <div>
                    ${spot.price*5}
                </div>
            </div>
        </div>
    )
}

export default Bookings;
