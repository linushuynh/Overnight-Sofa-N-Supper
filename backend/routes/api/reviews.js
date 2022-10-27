const express = require('express')
const router = express.Router();

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { json } = require('sequelize');

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

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        // const currentUserId = req.user.toJSON().id;
        const { user } = req;
        const currentUser = await User.findByPk(user.id);
        const reviews = await currentUser.getReviews();

        // To make changes to each review, map out in a promise
        const reviewsArray = await Promise.all(reviews.map(async (review) => {
            const rev = review.toJSON();

            // Query and Append User
            let addUser = await User.findByPk(user.id, {
                attributes: ['id', 'firstName', 'lastName']
            });

            addUser = addUser.toJSON();
            rev.User = addUser;


            // Query and append Spot
            let addSpot = await Spot.findOne({
                where: { ownerId: user.id },
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            addSpot = addSpot.toJSON();
            rev.Spot = addSpot

            // Query and append a preview image to the Spot
            let spotImg = await SpotImage.findOne({
                where: {
                    spotId: addSpot.id,
                    preview: true
                },
                attributes: [ 'url' ]
            });
            spotImg = spotImg.toJSON();
            rev.Spot.previewImage = spotImg.url

            // Query ReviewImages list
            let reviewImgs = await ReviewImage.findAll({
                where: { reviewId: rev.id },
                attributes: ['id', 'url']
            })

                // Convert each item in ReviewImgs list into readable object and append to review
                let reviewImgList = await Promise.all(reviewImgs.map(async (img) => {
                    img = img.toJSON();
                    return img
                }))
                rev.ReviewImages = reviewImgList

            return rev
        }))

        return res.json({
            Reviews: reviewsArray
        })
    });

router.post(
    '/:reviewId/images',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const { reviewId } = req.params;
        const { url } = req.body;

        const review = await Review.findByPk(reviewId);

        // Check if number of images for review is > 10
        const reviewImages = await review.getReviewImages();
        if (reviewImages.length > 10) {
            res.status(403);
            return res.json({
                "message": "Maximum number of images for this resource was reached",
                "statusCode": 403
              });
        }

        // Error handling for non-existent reviews
        if (!review) {
            res.status(404);
            return res.json({
                message: "Review couldn't be found",
                statusCode: 404
            })
        }

        // Authorization
        if (user.id !== review.userId) {
            res.status(403);
            return res.json({
                message: "You must be authorized to perform this action.",
                statusCode: 403
            })
        };

        // Create ReviewImage using review's special method
        const img = await review.createReviewImage({
            url
        });

        return res.json({
            id: img.id,
            url
        });
    }
);

router.put(
    '/:reviewId',
    requireAuth,
    validateReviewBody,
    async (req, res) => {
        const { user } = req;
        const { reviewId } = req.params;
        const { review, stars } = req.body;

        let updatedReview = await Review.findByPk(reviewId);

        // Error handling for non-existent reviews
        if (!updatedReview) {
            res.status(404);
            return res.json({
                message: "Review couldn't be found",
                statusCode: 404
            })
        }

        // Authorization
        if (user.id !== updatedReview.userId) {
            res.status(403);
            return res.json({
                message: "You must be authorized to perform this action.",
                statusCode: 403
            })
        }

        // Update the selected review
        updatedReview.set({
            review,
            stars
        });
        await updatedReview.save();

        return res.json(updatedReview)
    }
);

router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const { reviewId } = req.params;

        const destroyReview = await Review.findByPk(reviewId);

        // Error handling for non-existent reviews
        if (!destroyReview) {
            res.status(404);
            return res.json({
                message: "Review couldn't be found",
                statusCode: 404
            })
        }

        // Authorization
        if (user.id !== destroyReview.userId) {
            res.status(403);
            return res.json({
                message: "You must be authorized to perform this action.",
                statusCode: 403
            })
        }

        await destroyReview.destroy();
        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        });
    }
);
module.exports = router;
