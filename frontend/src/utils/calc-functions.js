// Takes infinite decimals and rounds to nearest hundredth place
export const shaveRating = (avgRating) => {
    if (!avgRating) return
    return Math.round(+avgRating*100)/100
}
