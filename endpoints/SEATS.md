Seats API Documentation

api/v1/seats

1. GET /

- Description: Checks if the seats router is working.

- Request Body: None

- Possible Responses:
  - 200 OK: Confirmation that the seats router is working.
    Response:
    {
        "message": "Seats router working"
    }

2. GET /read/from

- Description: Retrieves all seats for a specific theatre. The user must be authenticated.

- Expected Query Parameter:
  - id: "number" (theatre ID)

- Possible Responses:
  - 200 OK: List of seats in the specified theatre.
    Response:
    {
        "message": "There are X seats in this theatre",
        "result": [
            {
                "id": "number",
                "seatNumber": "string",
                "parentTheatre": "number"
            },
            ...
        ]
    }
  - 400 Bad Request: Invalid theatre ID provided.
    Response:
    {
        "message": "Invalid theatre ID provided"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: No theatre found for the given ID.
    Response:
    {
        "message": "No theatre found for the given ID"
    }
  - 500 Internal Server Error: An error occurred while retrieving seats.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }
