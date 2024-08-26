Users API Documentation

https://movies-backend.aayush0325.workers.dev/api/v1/users

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

- Description: Creates a new user entry. The user must be authenticated.

- Expected Request Body:
  {
      "firstName": "string",
      "lastName": "string"
  }

- Possible Responses:
  - 201 Created: User created successfully.
    Response:
    {
        "message": "User created successfully"
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
  - 500 Internal Server Error: An error occurred while creating the user.
    Response:
    {
        "message": "Failed to create user",
        "error": "Error message here"
    }

3. GET /read

- Description: Fetches details of the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: User details are returned.
    Response:
    {
        "firstName": "string",
        "lastName": "string",
        "createdAt": "string",
        "balance": "number"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: User not found.
    Response:
    {
        "message": "User Not Found"
    }
  - 500 Internal Server Error: An error occurred while fetching user details.
    Response:
    {
        "message": "Failed to fetch user",
        "error": "Error message here"
    }

4. DELETE /delete

- Description: Deletes the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: User deleted successfully.
    Response:
    {
        "message": "User deleted successfully"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: User not found or already deleted.
    Response:
    {
        "message": "User not found or already deleted"
    }
  - 500 Internal Server Error: An error occurred while deleting the user.
    Response:
    {
        "message": "Failed to delete user",
        "error": "Error message here"
    }

5. PUT /update

- Description: Updates the details of the authenticated user.

- Expected Request Body:
  {
      "firstName": "string (optional)",
      "lastName": "string (optional)"
  }

- Possible Responses:
  - 200 OK: User updated successfully.
    Response:
    {
        "message": "User updated successfully"
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
  - 500 Internal Server Error: An error occurred while updating the user.
    Response:
    {
        "message": "Failed to update user",
        "error": "Error message here"
    }

6. GET /bookings

- Description: Fetches booking details for the authenticated user, including theatre name, movie name, and booked seats.

- Request Body: None

- Possible Responses:
  - 200 OK: List of bookings is returned.
    Response:
    {
        "bookings": [
            {
                "theatreName": "string",
                "movieName": "string",
                "seats": ["string", ...]
            },
            ...
        ]
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 500 Internal Server Error: An error occurred while fetching bookings.
    Response:
    {
        "message": "Failed to fetch bookings",
        "error": "Error message here"
    }
