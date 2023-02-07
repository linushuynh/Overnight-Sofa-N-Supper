## About Overnight S&S

[![SVG Banners](https://svg-banners.vercel.app/api?type=origin&text1=Overnight%20SnS%20🌙&text2=Sofa%20and%20Supper&width=800&height=400)](https://github.com/Akshay090/svg-banners)


### 🛏️ An AirBnB Clone

Overnight S&S is a clone of AirBnB where you can find spots to reserve bookings and stay. You can also host your own spots and make reviews for other hosts' spots.
The live site is located at: [https://overnightsns.onrender.com/](https://overnightsns.onrender.com/)

This project was built with:

[![My Skills](https://skillicons.dev/icons?i=js,react,express,html,css,gcp,redux,postgres,postman)](https://skillicons.dev)
* Javascript
* React 
* Express
* HTML
* CSS
* Google Cloud Platform
* Redux
* PostgreSQL
* Postman


### 👨‍💻Code Snippets:
*The code snippet below is used for setting up booking dates and when a user submits their booking*

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [successBooking, setSuccessBooking] = useState(false);
    const [errs, setErrs] = useState([]);
    const dispatch = useDispatch();
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Triggered when user hits Reserve Booking button
    const submitBooking = async(e) => {
        e.preventDefault()
        setErrs([])
        const input = {
            startDate,
            endDate
        }
        await dispatch(createBookingThunk(input, spot.id))
        .then(() => setSuccessBooking(true))
        .then(() => setHasSubmitted(true))
        .catch(async (res) => {
            const data = await res.json();
            await setErrs([data.message])
          })
    }

    // This is to re-render new data after the user submits their booking
    useEffect(() => {
        setHasSubmitted(false)
    }, [hasSubmitted])</code>

*This next code snippet is a thunk that send a GET request to the API and retrieves all the spots in the database then saves it into the redux slice of state*
<br />

    export const getAllSpots = () => async (dispatch) => {
      const response = await csrfFetch('/api/spots')
      const data = await response.json();

      if (response.ok) {
        dispatch(setSpots(data.Spots))
      }

      return response
    }


The link to the wiki can be found at: https://github.com/linushuynh/Overnight-Sofa-N-Supper/wiki

Various features can be tested through the Demo-User.
First log-in in the top right and then you can go to Manage your listings. From there you will be able to create your own listing and edit as well as delete it.
Not only that, you can visit other listings on the main page(accessible through clicking the top left Overnight S&S text). 
While you visit other listings, you will see other people's reviews and can leave your own as well. If you change your mind about the review, you can delete it right away.
The beauty of this project lies in its simplicity and speed. 

<img width="959" alt="image" src="https://user-images.githubusercontent.com/109188075/203064609-02b29990-23cc-431e-bcd9-f1e2b7877f1a.png">

<img width="959" alt="Screenshot 2023-02-06 164813" src="https://user-images.githubusercontent.com/109188075/217119874-ebb14bbb-b4ea-482c-bb24-170a3d421a51.png">

<img width="959" alt="Screenshot 2023-02-06 164939" src="https://user-images.githubusercontent.com/109188075/217120032-13dc29cc-8538-47a1-ae61-bb16edc4f058.png">

Thank you for checking out the website!
