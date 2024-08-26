Movies API Documentation

api/v1/movies/

1. GET /

- Description: Checks if the movies router is working and if the user is logged in.

- Request Body: None

- Possible Responses:
  - 200 OK: Confirmation that the movies router is working and the user is logged in.
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

- Description: Creates a new movie entry. The user must be authenticated.

- Expected Request Body:
  - title: "string" (movie title)
  - description: "string" (movie description)
  - durationMinutes: "number" (duration of the movie in minutes)
  - releaseDate: "string" (release date in ISO format)
  - posterUrl: "string" (URL to the movie poster)

- Possible Responses:
  - 201 Created: Movie created successfully.
    Response:
    {
        "message": "Movie Created",
        "title": "string",
        "description": "string",
        "durationMinutes": "number",
        "releaseDate": "string",
        "posterUrl": "string"
    }
  - 400 Bad Request: Invalid input.
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
        "message": "Failed to create movie",
        "error": "Error message here"
    }

3. GET /read/personal

- Description: Retrieves movies created by the authenticated user.

- Request Body: None

- Possible Responses:
  - 200 OK: List of movies created by the authenticated user.
    Response:
    {
        "result": [
            {
                "id": "number",
                "title": "string",
                "description": "string",
                "durationMinutes": "number",
                "releaseDate": "string",
                "posterUrl": "string",
                "director": "string"
            },
            ...
        ]
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching movies.
    Response:
    {
        "message": "Failed to fetch movies",
        "error": "Error message here"
    }

4. GET /read/bulk

- Description: Searches for movies by title. The user must be authenticated.

- Expected Query Parameter:
  - filter: "string" (search term for movie title)

- Possible Responses:
  - 200 OK: List of movies matching the search term.
    Response:
    {
        "result": [
            {
                "id": "number",
                "title": "string",
                "description": "string",
                "durationMinutes": "number",
                "releaseDate": "string",
                "posterUrl": "string",
                "director": "string"
            },
            ...
        ]
    }
  - 400 Bad Request: Invalid search term.
    Response:
    {
        "message": "Invalid Search"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching movies.
    Response:
    {
        "message": "Failed to fetch movies",
        "error": "Error message here"
    }

5. GET /read/display

- Description: Retrieves a list of up to 10 movies. The user must be authenticated.

- Request Body: None

- Possible Responses:
  - 200 OK: List of up to 10 movies.
    Response:
    {
        "result": [
            {
                "id": "number",
                "title": "string",
                "description": "string",
                "durationMinutes": "number",
                "releaseDate": "string",
                "posterUrl": "string",
                "director": "string"
            },
            ...
        ]
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in."
    }
  - 500 Internal Server Error: An error occurred while fetching movies.
    Response:
    {
        "message": "Failed to fetch movies",
        "error": "Error message here"
    }

6. DELETE /delete

- Description: Deletes a movie by ID. The user must be authenticated.

- Expected Query Parameter:
  - id: "number" (movie ID)

- Possible Responses:
  - 200 OK: Movie deleted successfully.
    Response:
    {
        "message": "Movie deleted successfully"
    }
  - 400 Bad Request: Invalid movie ID provided.
    Response:
    {
        "message": "Invalid movie ID provided"
    }
  - 401 Unauthorized: User is not logged in.
    Response:
    {
        "message": "You are not logged in"
    }
  - 404 Not Found: No movie found for the given ID.
    Response:
    {
        "message": "No movie found for the given ID"
    }
  - 500 Internal Server Error: An error occurred while deleting the movie.
    Response:
    {
        "message": "Internal Server Error",
        "error": "Error message here"
    }
