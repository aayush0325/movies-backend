# Showtimes API Documentation

Base URL: /api/v1/shows

Endpoints:

1. GET /
   - Description: Checks if the user is authenticated.
   - Request Body: None
   - Possible Responses:
     - 200 OK: User is logged in.
       Response Body:
       {
         "message": "You are logged in!"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }

2. POST /create
   - Description: Creates a new showtime entry.
   - Request Body:
     {
       "movieId": number,
       "theatreId": number,
       "startTime": string,
       "endTime": string,
       "price": number
     }
   - Possible Responses:
     - 201 Created: Showtime created successfully.
       Response Body:
       {
         "message": "Show Created",
         "result": object
       }
     - 400 Bad Request: Invalid inputs.
       Response Body:
       {
         "message": "Invalid inputs"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 500 Internal Server Error: Failed to create showtime.
       Response Body:
       {
         "message": "Failed to create show",
         "error": string
       }


 GET /read/home

- Description: Retrieves showtimes for the home page with a limit on the number of shows returned.
- Request Query Parameters:
  - `limit` (optional): The maximum number of showtimes to return. Default is 10 if not provided.
- Request Body: None
- Possible Responses:
  - 200 OK: Showtimes retrieved successfully.

    [
      {
        "showtimeId": number,
        "startTime": string, // ISO date-time string
        "endTime": string,   // ISO date-time string
        "price": number,
        "movieTitle": string,
        "posterUrl": string,
        "theatreName": string
      },
      ...
    ]

  - 500 Internal Server Error: Failed to fetch shows for the home page.

    {
      "message": "Failed to fetch shows for home page",
      "error": string
    }



3. GET /read/personal
   - Description: Retrieves all showtimes created by the authenticated user.
   - Request Body: None
   - Possible Responses:
     - 200 OK: Showtimes retrieved successfully.
       Response Body:
       [
         {
           "showtimeId": number,
           "startTime": string,
           "endTime": string,
           "price": number,
           "movieTitle": string,
           "posterUrl": string,
           "theatreName": string
         },
         ...
       ]
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 500 Internal Server Error: Failed to fetch personal showtimes.
       Response Body:
       {
         "message": "Failed to fetch personal showtimes",
         "error": string
       }

4. GET /read/theatre
   - Description: Retrieves all showtimes for a specific theatre.
   - Request Query Parameters:
     - id: The ID of the theatre.
   - Request Body: None
   - Possible Responses:
     - 200 OK: Showtimes retrieved successfully.
       Response Body:
       [
         {
           "showtimeId": number,
           "startTime": string,
           "endTime": string,
           "price": number,
           "movieTitle": string,
           "posterUrl": string,
           "theatreName": string
         },
         ...
       ]
     - 400 Bad Request: Invalid theatre ID provided.
       Response Body:
       {
         "message": "Invalid theatre ID provided"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 500 Internal Server Error: Failed to fetch showtimes for the theatre.
       Response Body:
       {
         "message": "Failed to fetch showtimes for theatre",
         "error": string
       }

5. DELETE /delete/byUSER
   - Description: Deletes all showtimes created by the authenticated user.
   - Request Body: None
   - Possible Responses:
     - 200 OK: Showtimes deleted successfully.
       Response Body:
       {
         "message": "Showtimes deleted successfully"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 404 Not Found: No showtimes found for the authenticated user.
       Response Body:
       {
         "message": "No showtimes found for the given ID"
       }
     - 500 Internal Server Error: Failed to delete showtimes.
       Response Body:
       {
         "message": "Failed to delete showtimes",
         "error": string
       }

6. DELETE /delete/byID
   - Description: Deletes a specific showtime by its ID.
   - Request Query Parameters:
     - id: The ID of the showtime to delete.
   - Request Body: None
   - Possible Responses:
     - 200 OK: Showtime deleted successfully.
       Response Body:
       {
         "message": "Showtime deleted successfully"
       }
     - 400 Bad Request: Invalid showtime ID provided.
       Response Body:
       {
         "message": "Invalid showtime ID provided"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 404 Not Found: No showtime found for the given ID.
       Response Body:
       {
         "message": "No showtime found for the given ID"
       }
     - 500 Internal Server Error: Failed to delete showtime.
       Response Body:
       {
         "message": "Failed to delete showtime",
         "error": string
       }

7. POST /booking
   - Description: Books one or more seats for a specific showtime.
   - Request Body:
     {
       "showtimeId": number,
       "seatIds": number[]
     }
   - Possible Responses:
     - 201 Created: Seats booked successfully.
       Response Body:
       {
         "message": "Seats booked successfully",
         "bookings": object,
         "newBalance": number
       }
     - 400 Bad Request: Invalid inputs.
       Response Body:
       {
         "message": "Invalid inputs"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 402 Payment Required: Insufficient balance to book seats.
       Response Body:
       {
         "message": "Insufficient balance",
         "requiredBalance": number
       }
     - 404 Not Found: Showtime or user not found.
       Response Body:
       {
         "message": "Showtime not found" / "User not found"
       }
     - 409 Conflict: One or more seats are already booked for this showtime.
       Response Body:
       {
         "message": "One or more seats are already booked for this showtime",
         "bookedSeats": number[]
       }
     - 500 Internal Server Error: Failed to book seats.
       Response Body:
       {
         "message": "Failed to book seats",
         "error": string
       }

8. GET /seats/:showtimeId
   - Description: Retrieves seat status for a specific showtime.
   - URL Parameters:
     - showtimeId: The ID of the showtime.
   - Request Body: None
   - Possible Responses:
     - 200 OK: Seats retrieved successfully.
       Response Body:
       {
         "message": "Seats retrieved successfully",
         "seats": [
           {
             "seatId": number,
             "seatNumber": string,
             "isBooked": boolean
           },
           ...
         ]
       }
     - 400 Bad Request: Invalid showtime ID provided.
       Response Body:
       {
         "message": "Invalid showtime ID"
       }
     - 401 Unauthorized: User is not logged in.
       Response Body:
       {
         "message": "You are not logged in."
       }
     - 404 Not Found: Showtime not found.
       Response Body:
       {
         "message": "Showtime not found"
       }
     - 500 Internal Server Error: Failed to retrieve seats.
       Response Body:
       {
         "message": "Failed to retrieve seats",
         "error": string
       }
