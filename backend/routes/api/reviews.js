const express = require('express')
const router = express.Router();

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { json } = require('sequelize');

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


module.exports = router;
