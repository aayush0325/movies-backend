Theatres API Documentation

api/v1/theatres

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

- Description: Creates a new theatre entry in the database with the specified number of seats. The user must be authenticated.

- Expected Request Body:
  {
      "name": "string (min length: 3)",
      "location": "string (min length: 3)",
      "totalSeats": "number (min: 25, max: 100)"
  }

- Possible Responses:
  - 201 Created: Theatre was created successfully with the specified number of seats.
    Response:
    {
        "message": "You have created a theatre with {totalSeats} Seats",
        "theatreId": "number (theatre ID)"
    }
  - 400 Bad Request: The input data is invalid.
    Response:
    {
        "message": "Invalid Inputs"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 500 Internal Server Error: An error occurred while creating the theatre.
    Response:
    {
        "message": "Failed to create theatre",
        "error": "Error message here"
    }

3. GET /read/bulk

- Description: Searches for theatres by name based on a provided filter.

- Expected Query Parameter:
  - `filter`: "string (the filter to search for in theatre names)"

- Possible Responses:
  - 200 OK: A list of theatres matching the filter is returned.
    Response:
    {
        "final": [
            {
                "name": "string",
                "location": "string",
                "totalSeats": "number",
                "id": "number (theatre ID)"
            },
            ...
        ]
    }
  - 400 Bad Request: The filter is invalid or empty.
    Response:
    {
        "message": "Invalid Search"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 500 Internal Server Error: An error occurred while searching for theatres.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }

4. GET /read/personal

- Description: Fetches all theatres owned by the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: A list of theatres owned by the user is returned.
    Response:
    [
        {
            "name": "string",
            "location": "string",
            "totalSeats": "number",
            "id": "number (theatre ID)"
        },
        ...
    ]
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 500 Internal Server Error: An error occurred while fetching the user's theatres.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }

5. DELETE /delete

- Description: Deletes a theatre owned by the authenticated user.

- Expected Query Parameter:
  - `id`: "number (theatre ID to be deleted)"

- Possible Responses:
  - 200 OK: Theatre was deleted successfully.
    Response:
    {
        "message": "Theatre deleted successfully"
    }
  - 400 Bad Request: The theatre ID is invalid or not provided.
    Response:
    {
        "message": "Invalid theatre ID provided"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: No theatre was found for the given ID.
    Response:
    {
        "message": "No theatre found for the given ID"
    }
  - 500 Internal Server Error: An error occurred while deleting the theatre.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }
