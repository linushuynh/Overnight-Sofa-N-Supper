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

        const reviewsArray = [];
        reviews.forEach((review) => {
            reviewsArray.push(review.toJSON())
        });

        reviewsArray.forEach(async (review) => {
            // Query and Append User
            let addUser = await User.findByPk(user.id, {
                attributes: ['id', 'firstName', 'lastName']
            });
            // addUser = addUser.toJSON();
            review.User = await addUser.dataValues;
            console.log(review.User)

            // Query and append Spot
            let addSpot = await Spot.findOne({
                where: { ownerId: user.id },
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            addSpot = await addSpot.toJSON();
            review.Spot = await addSpot
            // console.log(addSpot)



        })

        return res.json({
            Reviews: reviewsArray
        })
    });

router.put(
    '/:reviewId',
    requireAuth,
    validateReviewBody,
    async (req, res) => {
        const { user } = req;
        const { reviewId } = req.params;
        const { review, stars } = req.body;

        let updatedReview = await Review.findByPk(reviewId);

        // Authorization
        if (user.id !== updatedReview.userId) {
            res.status(403);
            return res.json({
                message: "You must be authorized to perform this action.",
                statusCode: 403
            })
        }

        // Error handling for non-existent review
        if (!updatedReview) {
            res.status(404);
            res.json({
                message: "Review couldn't be found",
                statusCode: 404
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
module.exports = router;
