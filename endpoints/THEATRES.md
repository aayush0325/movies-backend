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

- Description: Creates a new theatre. The user must be authenticated.

- Expected Request Body:
  {
      "name": "string",
      "location": "string",
      "totalSeats": "number"
  }

- Possible Responses:
  - 201 Created: Theatre created successfully with seats.
    Response:
    {
        "message": "You have created a theatre with X Seats",
        "theatreId": "number"
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

- Description: Fetches theatres based on a search filter.

- Expected Query Parameter:
  - filter: "string" (the search term for theatre names)

- Possible Responses:
  - 200 OK: List of theatres matching the filter.
    Response:
    {
        "final": [
            {
                "name": "string",
                "location": "string",
                "totalSeats": "number",
                "id": "number"
            },
            ...
        ]
    }
  - 400 Bad Request: Invalid search filter provided.
    Response:
    {
        "message": "Invalid Search"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 500 Internal Server Error: An error occurred while fetching theatres.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }

4. GET /read/personal

- Description: Fetches theatres owned by the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: List of theatres owned by the user.
    Response:
    [
        {
            "name": "string",
            "location": "string",
            "totalSeats": "number",
            "id": "number"
        },
        ...
    ]
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 500 Internal Server Error: An error occurred while fetching personal theatres.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }

5. DELETE /delete

- Description: Deletes a theatre by ID. The user must be authenticated.

- Expected Query Parameter:
  - id: "number" (the ID of the theatre to delete)

- Possible Responses:
  - 200 OK: Theatre deleted successfully.
    Response:
    {
        "message": "Theatre deleted successfully"
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
  - 500 Internal Server Error: An error occurred while deleting the theatre.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }
