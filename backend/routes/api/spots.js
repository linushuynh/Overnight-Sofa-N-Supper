const express = require('express')
const router = express.Router();

const { User, Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

router.get(
    '/',
    async (req, res) => {
        const spots = await Spot.findAll({
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage
                }
            ]
        });

        const spotList = [];

        // Translate list of spots into JSON for reading
        spots.forEach(async (spot) => {
            spotList.push(spot.toJSON())
        })

        // Perform the following code for each spot
        spotList.forEach(async (spot) => {
            // For every spot, find the reviews
            let reviewArray = spot.Reviews;
            let spotTotalAverage = 0;

            // Iterate through the reviews to key into the stars and add into spotTotalAverage
            reviewArray.forEach(async (review) => {
                spotTotalAverage += review.stars
            })
            spotTotalAverage /= reviewArray.length;
            spot.avgRating = spotTotalAverage;
            delete spot.Reviews;

            let spotImageArray = spot.SpotImages;

            // For every spot in the list, check if preview is true
            // and then set the url as previewImage key
            spotImageArray.forEach(async (image) => {
                if (image.preview === true) {
                    spot.previewImage = image.url
                }
                delete spot.SpotImages
            })

        })

        return res.json({
            Spots: spotList
        })
    }
)

router.get(
    '/current',
    // ADDED AUTHORIZATION
    requireAuth,
    async (req, res) => {
        const userid = req.user.toJSON().id
        const spots = await Spot.findAll({
            // DIFFERENCE IS IN THIS WHERE
            where: {
                ownerId: userid
            },
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage
                }
            ]
        });

        const spotList = [];

        // Translate list of spots into JSON for reading
        spots.forEach(async (spot) => {
            spotList.push(spot.toJSON())
        })

        // Perform the following code for each spot
        spotList.forEach(async (spot) => {
            // For every spot, find the reviews
            let reviewArray = spot.Reviews;
            let spotTotalAverage = 0;

            // Iterate through the reviews to key into the stars and add into spotTotalAverage
            reviewArray.forEach(async (review) => {
                spotTotalAverage += review.stars
            })
            spotTotalAverage /= reviewArray.length;
            spot.avgRating = spotTotalAverage;
            delete spot.Reviews;

            let spotImageArray = spot.SpotImages;

            // For every spot in the list, check if preview is true
            // and then set the url as previewImage key
            spotImageArray.forEach(async (image) => {
                if (image.preview === true) {
                    spot.previewImage = image.url
                }
                delete spot.SpotImages
            })

        })

        return res.json({
            Spots: spotList
        })
})


module.exports = router;
