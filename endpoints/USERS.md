User API Documentation


api/v1/users

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

- Description: Creates a new user entry in the database. The user must be authenticated.

- Expected Request Body:
  {
      "firstName": "string (min length: 3)",
      "lastName": "string (min length: 3)"
  }

- Possible Responses:
  - 201 Created: User was created successfully.
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

- Description: Fetches the details of the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: User data is returned.
    Response:
    {
        "firstName": "string",
        "lastName": "string",
        "createdAt": "string (ISO date format)",
        "balance": "number"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: User not found in the database.
    Response:
    {
        "message": "User Not Found"
    }
  - 500 Internal Server Error: An error occurred while fetching the user data.
    Response:
    {
        "message": "Failed to fetch user",
        "error": "Error message here"
    }

4. PUT /update

- Description: Updates the details of the authenticated user. The user must be authenticated.

- Expected Request Body:
  {
      "firstName": "string (min length: 3, optional)",
      "lastName": "string (min length: 3, optional)",
      "balance": "number (min: 5000, optional)"
  }

- Possible Responses:
  - 200 OK: User was updated successfully.
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
  - 500 Internal Server Error: An error occurred while updating the user data.
    Response:
    {
        "message": "Failed to update user",
        "error": "Error message here"
    }

5. DELETE /delete

- Description: Deletes the authenticated user from the database.

- Request Body: None

- Possible Responses:
  - 200 OK: User was deleted successfully.
    Response:
    {
        "message": "User deleted successfully"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: User not found in the database.
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
