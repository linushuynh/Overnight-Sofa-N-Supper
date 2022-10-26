const express = require('express')
const router = express.Router();

const { User, Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

// const validateBody = [
//     check("")
// ]

router.get(
    '/:spotId',
    async (req, res) => {
        // Finding the spot by spotId
        const { spotId } = req.params;
        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    attributes: ["id", "url", "preview"]
                }
            ]
        });

        // Error handling for undefined spotId
        if (!spot) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              });
        };

        //Initialize spot response
        let jsonSpot = spot.toJSON();

        // Find and append owner to spot response
        const owner = await User.findOne({
            include: [
                { model: Spot,
                where: {
                    id: spotId
                }
                }
            ]
        });
        const jsonOwner = owner.toJSON()
        const { id, firstName, lastName} = jsonOwner
        jsonSpot.Owner = {
            id,
            firstName,
            lastName
        };

        //Calculate reviews
        let reviewArray = jsonSpot.Reviews;
        let spotTotalAverage = 0;

        // Iterate through the reviews to key into the stars and add into spotTotalAverage
        reviewArray.forEach(async (review) => {
            spotTotalAverage += review.stars
        })
        spotTotalAverage /= reviewArray.length;

        // Append numReviews and avgRating
        jsonSpot.numReviews = reviewArray.length;
        jsonSpot.avgRating = spotTotalAverage;
        delete jsonSpot.Reviews;

        return res.json(jsonSpot);
    }
);

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
    });

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
);

router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res) => {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            await res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        }

        const newSpotImage = await SpotImage.create({
            spotId,
            url,
            preview
        })

        const { id } = newSpotImage;


        res.json({
            id,
            url,
            preview
        })
    }
);

router.post(
    '/',
    requireAuth,
    async (req, res) => {
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        } = req.body;

        const userid = req.user.toJSON().id;

        const newSpot = await Spot.create({
            ownerId: userid,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        res.status(201)
        return res.json(newSpot)
    });

module.exports = router;
