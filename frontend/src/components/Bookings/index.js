import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBookingThunk } from '../../store/booking';
import styles from './Bookings.module.css'
import { defaultStartDate, defaultEndDate, differenceInDays } from '../../utils/date-management';
import { shaveRating } from '../../utils/calc-functions';

function Bookings({ spot }) {
    const [startDate, setStartDate] = useState(defaultStartDate)
    const [endDate, setEndDate] = useState(defaultEndDate)
    const [successBooking, setSuccessBooking] = useState(false)
    const [errs, setErrs] = useState([])
    const dispatch = useDispatch()
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const submitBooking = async(e) => {
        e.preventDefault()
        setErrs([])
        const input = {
            startDate,
            endDate
        }
        await dispatch(createBookingThunk(input, spot.id))
        .then(() => setSuccessBooking(true))
        .then(() => setHasSubmitted(true))
        .catch(async (res) => {
            const data = await res.json();
            await setErrs([data.message])
          })
    }

    // This is for when the user submits their booking, calls a re-render
    useEffect(() => {
        setHasSubmitted(false)
    }, [hasSubmitted])

    return (
        <div className={styles.bookingsContainer}>
            <div className={styles.headerContainer}>
                    <div className={styles.price}>${spot.price} <span>night</span></div>
                    <div className={styles.reviewInfo}>★{shaveRating(spot.avgRating)} · {spot.numReviews} reviews</div>
            </div>
            <div className={styles.formContainer}>
                <form onSubmit={submitBooking}>
                    <div className={styles.inputContainer}>
                        <input
                            type="date"
                            className={styles.startDateInput}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            >
                        </input>
                        <hr />
                        <input
                            type="date"
                            className={styles.endDateInput}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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
            {successBooking && (<div className={styles.successfulBooking}>
                You're all booked! We look forward to seeing you!
            </div>)}
            {errs.length > 0 && (errs.map((error, index) => (
                <div key={index} className={styles.error}>
                    {error}
                </div>
            )))}
            <div style={{ fontWeight: "300", fontSize: "12px" }}>
                You won't be charged yet
            </div>
            <div className={styles.calcContainer}>
                <div className={styles.calcDiv}>
                    <div className={styles.calcText}>
                        ${spot.price} x {differenceInDays(startDate, endDate)} nights
                    </div>
                    <div>
                        ${(spot.price*differenceInDays(startDate, endDate)).toLocaleString('en-us')}
                    </div>
                </div>
                <div className={styles.calcDiv}>
                    <div className={styles.calcText}>
                        Cleaning fee(9%)
                    </div>
                    <div>
                    ${Math.ceil(spot.price*0.09)}
                    </div>
                </div>
                <div className={styles.calcDiv}>
                    <div className={styles.calcText}>
                        Service fee(15%)
                    </div>
                    <div>
                        ${Math.ceil(spot.price*0.15)}
                    </div>
                </div>
            </div>
            <hr style={{ width: "85%", opacity: "45%" }} />
            <div className={styles.totalContainer}>
                <div>
                    Total before taxes
                </div>
                <div>
                    ${(spot.price*differenceInDays(startDate, endDate) + Math.ceil(spot.price*0.15) + Math.ceil(spot.price*0.2)).toLocaleString('en-us')}
                </div>
            </div>
        </div>
    )
}

export default Bookings;
