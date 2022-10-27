const express = require('express');
const router = express.Router();

const { User, Spot, Review, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;

        const bookings = await user.getBookings({
            include: [ {
                model: Spot
            } ],
        })

        // Map out each booking in new array of promises
        let bookingArray = await Promise.all(bookings.map(async (bkng) => {
            let booking = bkng.toJSON();

            // Query and append PreviewImage for the spot
            let previewImg = await SpotImage.findByPk(booking.Spot.id,
                {
                    where: { preview: true }
                }
            );
            previewImg = previewImg.toJSON();
            booking.Spot.previewImage = previewImg.url;

            // returns object back into array
            return booking
        }));

        return res.json({
            Bookings: bookingArray
        })
    }
);

module.exports = router;
