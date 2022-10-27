const express = require('express');
const router = express.Router();

const { User, Spot, Review, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

// GET BOOKINGS FOR CURRENT USER
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

// EDIT A BOOKING
router.put(
    '/:bookingId',
    requireAuth,
    async(req, res) => {
        const { user } = req;
        const { bookingId } = req.params;
        const { startDate , endDate } = req.body;
        const updateBooking = await Booking.findByPk(bookingId);

        // Authorization for owners
        if (updateBooking.userId !== user.id) {
            res.status(403);
            return res.json({
                message: "You must be authorized to perform this action.",
                statusCode: 403
            })
        }

        // Body Validation Errors
        const startDateObj = new Date(startDate);
        const startDateStr = startDateObj.toDateString();
        const startDateTimelessObj = new Date(startDateStr);
        const startDateCompare = startDateTimelessObj.getTime();

        const endDateObj = new Date(endDate);
        const endDateStr = endDateObj.toDateString();
        const endDateTimelessObj = new Date(endDateStr);
        const endDateCompare = endDateTimelessObj.getTime();

        if (startDateCompare > endDateCompare) {
            res.status(400);
            return res.json({
                message: "Validation error",
                statusCode: 400,
                errors: {
                    "endDate": "endDate cannot come before startDate"
                }
            })
        }

        // Booking Conflicts(Check through every booking)
        let allBookings = await Booking.findAll({
            where: { id: bookingId }
        });
        let bookingArray = [];
        allBookings.forEach(async (booking) => {
            bookingArray.push(booking.toJSON())
        })

        for (let booking of bookingArray){
            // Converting date into time number for comparison
            const bookingStartDate = new Date(booking.startDate);
            const bookingStartDateOnly = new Date(bookingStartDate.toDateString());
            const bookingStartDateCompare = bookingStartDateOnly.getTime();

            const bookingEndDate = new Date(booking.endDate);
            const bookingEndDateOnly = new Date(bookingEndDate.toDateString());
            const bookingEndDateCompare = bookingEndDateOnly.getTime();

            const errsObj = {};

            // Check if startDate or endDate is between the existing booking's time
            if (bookingStartDateCompare <= startDateCompare && startDateCompare <= bookingEndDateCompare) {
                errsObj.startDate = "Start date conflicts with an existing booking";
            }
            if (bookingStartDateCompare <= endDateCompare && endDateCompare <= bookingEndDateCompare) {
                errsObj.endDate = "End date conflicts with an existing booking";
            }

            if (Object.keys(errsObj).length !== 0) {
                res.status(403);
                return res.json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    errors: errsObj
                })
            }
        }

        await updateBooking.set({
            startDate,
            endDate
        })
        await updateBooking.save()

        return res.json(updateBooking)

    }
);


// DELETE BOOKING
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const { bookingId } = req.params;

        const deleteBooking = await Booking.findByPk(bookingId);

        if (!deleteBooking) {
            res.status(404)
            return res.json({
                message: "Booking couldn't be found",
                statusCode: 404
            })
        }

        await deleteBooking.destroy();

        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
);

module.exports = router;
