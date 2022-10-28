const express = require('express');
const router = express.Router();

const { Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

router.delete(
    '/:imageId',
    requireAuth,
    async(req, res) => {
        const { user } = req;
        const { imageId } = req.params;

        const deleteSpotImg = await SpotImage.findByPk(imageId);

        // Error handling for non-existent spot
        if (!deleteSpotImg) {
            res.status(404)
            return res.json({
                message: "Spot Image couldn't be found",
                statusCode: 404
            })
        }

        // Authorization for owners only
        let spot = await Spot.findByPk(deleteSpotImg.spotId);
        spot = spot.toJSON();
        if (spot.ownerId !== user.id) {
            res.status(403);
            return res.json({
                message: 'You are unauthorized to delete this image'
            })
        }

        await deleteSpotImg.destroy();
        return res.json({
            message: "Succesfully deleted",
            statusCode: 200
        })
    }
);

module.exports = router;
