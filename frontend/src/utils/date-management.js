// Checks values of month and days and transforms it into two-digit form
export const dateBefore10 = (value) => {
    if (value < 10) return `0${value}`
    else return value
}

// ****************************************

// Creates date object for today and another one two days from today for starter use in bookings
const today = new Date()
let todayYear = today.getFullYear()
let todayMonth = +today.getMonth() + 1
todayMonth = dateBefore10(todayMonth)
let todayDay = today.getDate()
todayDay = dateBefore10(todayDay)

const twoDaysLater = new Date(+today + 3600000 * 48)
let tdlYear = twoDaysLater.getFullYear()
let tdlMonth = +twoDaysLater.getMonth() + 1
tdlMonth = dateBefore10(tdlMonth)
let tdlDay = twoDaysLater.getDate()
tdlDay = dateBefore10(tdlDay)

export const defaultStartDate = `${todayYear}-${todayMonth}-${todayDay}`
export const defaultEndDate = `${tdlYear}-${tdlMonth}-${tdlDay}`

// ***************************************

// Takes in a numeric date and return the date in a string
export const convertToWords = (numDate) => {
    const newDate = new Date(numDate)
    return newDate.toLocaleString("en-us", { month: "short", day: "2-digit", year: "numeric" })
}

// ***************************************

// Takes in two dates and returns the difference in number of days
export const differenceInDays = (date1, date2) => {
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)
    const diff = dateObj2.getTime() - dateObj1.getTime()
    return diff / (1000*60*60*24)
}
