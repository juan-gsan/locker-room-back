# LockerRoom - You'll never play alone

LockerRoom is a user-friendly mobile application designed to bring football enthusiasts together and streamline the process of organizing and participating in friendly football games. Whether you're a seasoned player or someone looking to kick the ball around for fun, LockerRoom is your go-to platform for creating, joining, and managing football games with friends.

The server is hosted in render: https://lockerroom.onrender.com (Render is a free service and it turns non active projects in "sleeping mode"). Once you click in the link above, you should wait and it will only take a minute for the server to wake up!

The frontend user interface is hosted in vercel. After initiating the server, you can try the app by following the provided link: https://juan-garcia-final-project-front-202304-mad.vercel.app/

URL to github frontend repository: https://github.com/juan-gsan/locker-room-front

The backend API is built using Node.js, Express and TypeScript, implementing the Domain-Driven Design (DDD) architecture pattern. The project handles users and football games.

Authentication made with JWT.

Fully tested (100% coverage) with Jest.

Images handled with Firebase and optimized with Sharp.

## Installation

- Clone this repository
- Install dependencies with `npm install`
- Create a .env file and set the environment variables, following the example in sample.env
- Start the server with `npm run start:dev`

## Main Features

The API endpoints can be accessed using HTTP requests to the appropriate URL, as listed below:

### User

| Method | URL            | Description                                                                                         |
| ------ | -------------- | --------------------------------------------------------------------------------------------------- |
| POST   | /user/register | Register a new user. Required fields: `username`, `email`, `password`, `gender`, `level`, `avatar`. |
| PATCH  | /user/login    | Authenticate a user. Required fields: `username` or `email`, `password`.                            |
| GET    | /user          | Retrieve a list of users.                                                                           |
| GET    | /user/:id      | Retrieve a user by ID.                                                                              |

### Game

| Method | URL             | Description                                                                                                                                                                 |
| ------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /game           | Retrieve the games list with pagination. Optional query parameters: `filter`. Default query parameters: `limit` = 4, `offset`: indicates the page you are in at the moment. |
| GET    | /game/:id       | Retrieve a single game by ID.                                                                                                                                               |
| POST   | /game/create    | Create a new game. Requires authentication.                                                                                                                                 |
| PATCH  | /game/join/:id  | Update list of players in a game. Requires authentication.                                                                                                                  |
| PATCH  | /game/leave/:id | Update list of players in a game. Requires authentication.                                                                                                                  |
| PATCH  | /game/edit/:id  | Update properties of a game. Requires authentication and the ownership of the game.                                                                                         |
| DELETE | /game/:id       | Delete a game. Requires authentication and the ownership of the game.                                                                                                       |
