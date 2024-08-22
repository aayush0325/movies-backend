Movies API Documentation

api/v1/movies

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

- Description: Creates a new movie entry in the database. The user must be authenticated.

- Expected Request Body:
  {
      "title": "string (min length: 1)",
      "description": "string (min length: 5)",
      "durationMinutes": "number (min: 5)",
      "releaseDate": "string",
      "posterUrl": "string (optional)"
  }

- Possible Responses:
  - 201 Created: Movie was created successfully.
    Response:
    {
        "message": "Movie Created"
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
  - 500 Internal Server Error: An error occurred while creating the movie.
    Response:
    {
        "message": "Failed to create theatre",
        "error": "Error message here"
    }

3. GET /read/personal

- Description: Fetches all movies created by the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: A list of movies created by the user is returned.
    Response:
    {
        "result": [
            {
                "title": "string",
                "description": "string",
                "durationMinutes": "number",
                "releaseDate": "string",
                "posterUrl": "string",
                "id": "number (movie ID)"
            },
            ...
        ]
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching the user's movies.
    Response:
    {
        "message": "Failed to create theatre",
        "error": "Error message here"
    }

4. GET /read/bulk

- Description: Searches for movies by title based on a provided filter.

- Expected Query Parameter:
  - `filter`: "string (the filter to search for in movie titles)"

- Possible Responses:
  - 200 OK: A list of movies matching the filter is returned.
    Response:
    {
        "result": [
            {
                "title": "string",
                "description": "string",
                "durationMinutes": "number",
                "releaseDate": "string",
                "posterUrl": "string",
                "id": "number (movie ID)"
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
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while searching for movies.
    Response:
    {
        "message": "Failed to create theatre",
        "error": "Error message here"
    }

5. GET /read/display

- Description: Fetches a limited number (10) of movie entries from the database.

- Request Body: None

- Possible Responses:
  - 200 OK: A list of movies is returned.
    Response:
    {
        "result": [
            {
                "title": "string",
                "description": "string",
                "durationMinutes": "number",
                "releaseDate": "string",
                "posterUrl": "string",
                "id": "number (movie ID)"
            },
            ...
        ]
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching the movies.
    Response:
    {
        "message": "Failed to create theatre",
        "error": "Error message here"
    }

6. DELETE /delete

- Description: Deletes a movie created by the authenticated user.

- Expected Query Parameter:
  - `id`: "number (movie ID to be deleted)"

- Possible Responses:
  - 200 OK: Movie was deleted successfully.
    Response:
    {
        "message": "Theatre deleted successfully"
    }
  - 400 Bad Request: The movie ID is invalid or not provided.
    Response:
    {
        "message": "Invalid theatre ID provided"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: No movie was found for the given ID.
    Response:
    {
        "message": "No theatre found for the given ID"
    }
  - 500 Internal Server Error: An error occurred while deleting the movie.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }
