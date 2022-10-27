const express = require('express')
const router = express.Router();

const { User, Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const validateSpotBody = [
        check('address')
            .exists({ checkFalsy: true })
            .withMessage('Street address is required'),
        check('city')
            .exists({ checkFalsy: true })
            .withMessage('City is required'),
        check('state')
            .exists({ checkFalsy: true })
            .withMessage('State is required'),
        check('country')
            .exists({ checkFalsy: true })
            .withMessage('Country is required'),
        check('lat')
            .isDecimal()
            .withMessage('Latitude is not valid'),
        check('lng')
            .isDecimal()
            .withMessage('Longitude is not valid'),
        check('name')
            .exists({ checkFalsy: true })
            .isLength({ max: 50 })
            .withMessage('Name must be less than 50 characters'),
        check('description')
            .exists({ checkFalsy: true })
            .withMessage('Description is required'),
        check('price')
            .exists({ checkFalsy: true })
            .isCurrency()
            .withMessage('Price per day is required'),
        handleValidationErrors
    ];

const validateReviewBody = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt()
        .isIn([1,2,3,4,5])
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// GET SPOTS OF CURRENT USER
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

// GET SPOT BY SPOT'S ID
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
});

// GET ALL SPOTS
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

// CREATE REVIEW FOR SPOT
router.post(
    '/:spotId/reviews',
    requireAuth,
    validateReviewBody,
    async (req, res) => {
        const currentUserId = req.user.toJSON().id;
        const { review, stars } = req.body;
        const { spotId } = req.params;

        // Error Handling for non-existent spot
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found",
                "statusCode": 404
              });
        };

        // Error Handling for existing reviews
        const reviewCheck = await Review.findOne({
            where: { userId: currentUserId }
        });
        if (reviewCheck) {
            res.status(403);
            return res.json({
                "message": "User already has a review for this spot",
                "statusCode": 403
              });
        }

        // Create new review
        const newReview = await Review.create({
            userId: currentUserId,
            spotId: parseInt(spotId),
            review,
            stars,
        });

        res.status(201);
        return res.json(newReview);
    }
    );

// ADD IMAGE TO SPOT
router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res) => {
        const currentUserId = req.user.toJSON().id;
        const { spotId } = req.params;
        const { url, preview } = req.body;

        // Error Handling for non-existent spot
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            await res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        }

        // Authorization
        if (currentUserId !== spot.ownerId) {
            res.status(403);
            return res.json({
                message: "You must be authorized to perform this action.",
                statusCode: 403
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

// CREATE NEW SPOT
router.post(
    '/',
    requireAuth,
    validateSpotBody,
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

    //EDIT SPOT
    router.put(
        '/:spotId',
        requireAuth,
        validateSpotBody,
        async (req, res) => {
            const currentUserId = req.user.toJSON().id;

            const { address, city, state, country, lat, lng, name, description, price } = req.body;
            const { spotId } = req.params;

            // Select spot to update using spotId from param
            let updatedSpot = await Spot.findOne({
                where: { id: spotId }
            });

            // Authorization
            if (currentUserId !== updatedSpot.ownerId) {
                res.status(403);
                return res.json({
                    message: "You must be authorized to perform this action.",
                    statusCode: 403
                })
            }
            // Error Handling for non-existent spotId
            if (!updatedSpot) {
                res.status(404);
                return res.json({
                    message: "Spot couldn't be found",
                    statusCode: 404
                })
            }

            // Update values in selected Spot object
            updatedSpot.set({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description
            });
            await updatedSpot.save();

            res.json(updatedSpot);
        });

    // DELETE SPOT
    router.delete(
        '/:spotId',
        requireAuth,
        async (req, res) => {
            const { spotId } = req.params;
            const currentUserId = req.user.toJSON().id;

            // Select spot to destroy using spotId param
            const destroySpot = await Spot.findOne({
                where: {
                    id: spotId
                }
            });

            // Error Handling for non-existent spot id
            if (!destroySpot) {
                res.status(404);
                return res.json({
                    message: "Spot couldn't be found",
                    statusCode: 404
                })
            };

            // Authorization
            if (currentUserId !== destroySpot.ownerId) {
                res.status(403);
                return res.json({
                    message: "You must be authorized to perform this action.",
                    statusCode: 403
                })
            };

            await destroySpot.destroy();

            return res.json({
                message: "Successfully delete",
                statusCode: 200
            });
        });

module.exports = router;
