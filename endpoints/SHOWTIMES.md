Showtimes API Documentation

https://movies-backend.aayush0325.workers.dev/api/v1/shows

1. GET /

- Description: Checks if the user is authenticated.

- Request Body: None

- Possible Responses:
  - 200 OK: User is logged in.
    Response:
    {
        "message": "You are logged in!"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }

2. POST /create

- Description: Creates a new showtime. The user must be authenticated.

- Expected Request Body:
  {
      "theatreId": "number",
      "movieId": "number",
      "startTime": "string" (ISO format),
      "endTime": "string" (ISO format),
      "price": "number"
  }

- Possible Responses:
  - 201 Created: Showtime created successfully.
    Response:
    {
        "message": "Show Created",
        "result": { /* Showtime details */ }
    }
  - 400 Bad Request: The input data is invalid.
    Response:
    {
        "message": "Invalid inputs"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while creating the showtime.
    Response:
    {
        "message": "Failed to create show",
        "error": "Error message here"
    }

3. GET /read/personal

- Description: Fetches showtimes owned by the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: List of personal showtimes.
    Response:
    [
        {
            "id": "number",
            "theatreId": "number",
            "movieId": "number",
            "startTime": "string" (ISO format),
            "endTime": "string" (ISO format),
            "price": "number",
            "owner_id": "string"
        },
        ...
    ]
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching personal showtimes.
    Response:
    {
        "message": "Failed to fetch personal showtimes",
        "error": "Error message here"
    }

4. GET /read/theatre

- Description: Fetches showtimes for a specific theatre.

- Expected Query Parameter:
  - id: "number" (theatre ID)

- Possible Responses:
  - 200 OK: List of showtimes for the specified theatre.
    Response:
    [
        {
            "id": "number",
            "theatreId": "number",
            "movieId": "number",
            "startTime": "string" (ISO format),
            "endTime": "string" (ISO format),
            "price": "number",
            "owner_id": "string"
        },
        ...
    ]
  - 400 Bad Request: Invalid theatre ID provided.
    Response:
    {
        "message": "Invalid theatre ID provided"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching showtimes for the theatre.
    Response:
    {
        "message": "Failed to fetch showtimes for theatre",
        "error": "Error message here"
    }

5. DELETE /delete/byUSER

- Description: Deletes all showtimes created by the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: Showtimes deleted successfully.
    Response:
    {
        "message": "Showtimes deleted successfully"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while deleting showtimes.
    Response:
    {
        "message": "Failed to delete showtimes",
        "error": "Error message here"
    }

6. DELETE /delete/byID

- Description: Deletes a specific showtime by ID. The user must be authenticated.

- Expected Query Parameter:
  - id: "number" (showtime ID)

- Possible Responses:
  - 200 OK: Showtime deleted successfully.
    Response:
    {
        "message": "Showtime deleted successfully"
    }
  - 400 Bad Request: Invalid showtime ID provided.
    Response:
    {
        "message": "Invalid showtime ID provided"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 404 Not Found: No showtime found for the given ID.
    Response:
    {
        "message": "No showtime found for the given ID"
    }
  - 500 Internal Server Error: An error occurred while deleting the showtime.
    Response:
    {
        "message": "Failed to delete showtime",
        "error": "Error message here"
    }

7. POST /booking

- Description: Books seats for a showtime. The user must be authenticated.

- Expected Request Body:
  {
      "showtimeId": "number",
      "seatIds": ["number", ...]
  }

- Possible Responses:
  - 201 Created: Seats booked successfully.
    Response:
    {
        "message": "Seats booked successfully",
        "bookings": [ /* Booking details */ ],
        "newBalance": "number"
    }
  - 400 Bad Request: The input data is invalid.
    Response:
    {
        "message": "Invalid inputs"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 402 Payment Required: Insufficient balance for booking.
    Response:
    {
        "message": "Insufficient balance",
        "requiredBalance": "number"
    }
  - 404 Not Found: Showtime or user not found.
    Response:
    {
        "message": "Showtime not found" // or "User not found"
    }
  - 409 Conflict: One or more seats are already booked.
    Response:
    {
        "message": "One or more seats are already booked for this showtime",
        "bookedSeats": ["number", ...]
    }
  - 500 Internal Server Error: An error occurred while booking seats.
    Response:
    {
        "message": "Failed to book seats",
        "error": "Error message here"
    }

8. GET /seats/:showtimeId

- Description: Retrieves seat status for a specific showtime.

- Expected URL Parameter:
  - showtimeId: "number" (ID of the showtime)

- Possible Responses:
  - 200 OK: Seat status retrieved successfully.
    Response:
    {
        "message": "X Seats retrieved successfully",
        "seats": [
            {
                "seatId": "number",
                "seatNumber": "string",
                "isBooked": "number"
            },
            ...
        ]
    }
  - 400 Bad Request: Invalid showtime ID provided.
    Response:
    {
        "message": "Invalid showtime ID"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 404 Not Found: Showtime not found.
    Response:
    {
        "message": "Showtime not found"
    }
  - 500 Internal Server Error: An error occurred while retrieving seats.
    Response:
    {
        "message": "Failed to retrieve seats",
        "error": "Error message here"
    }
