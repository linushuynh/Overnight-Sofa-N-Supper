const express = require('express');
const router = express.Router();

const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const { imageId } = req.params;

        const deleteReviewImg = await ReviewImage.findByPk(imageId);

        // Error handling for non-existent review
        if (!deleteReviewImg) {
            res.status(404)
            return res.json({
                message: "Review Image couldn't be found",
                statusCode: 404
            })
        }

        // Authorization for owners only
        let review = await Review.findByPk(deleteReviewImg.reviewId);
        review = review.toJSON();
        if (review.userId !== user.id) {
            res.status(403);
            return res.json({
                message: 'Forbidden',
                statusCode: 403
            })
        }

        await deleteReviewImg.destroy();
        return res.json({
            message: "Succesfully deleted",
            statusCode: 200
        })
    }
);

module.exports = router;
