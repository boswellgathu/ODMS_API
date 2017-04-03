[![Build Status](https://travis-ci.org/andela-Bgathu/GDocs.svg?branch=develop)](https://travis-ci.org/andela-Bgathu/GDocs)
[![Coverage Status](https://coveralls.io/repos/github/andela-Bgathu/GDocs/badge.svg)](https://coveralls.io/github/andela-Bgathu/GDocs)
# GDocs
Online Document management system

### Installation
* Clone this repo `git clone https://github.com/andela-Bgathu/GDocs.git`
* Navigate to the folder `cd GDocs`
* Install all the packages `npm install`
* create a file named .env and inside the file set you environment variables, SECRET='your secret key word' and NODE_ENV='development'
* check the `server/config/config.json` settings, if ypu choose to use `development` in the above step, set up your database and username for the development object
* to finally run the app, type `npm start`

* if you would like to run the tests, `NODE_ENV=test npm test`


# API

* The api documentatio can be found here [link](https://gdocs-staging.herokuapp.com/api/docs)
* The API is hosted at [link](https://gdocs-staging.herokuapp.com/api/docs)

### End Points

## Roles [`/api/roles`]

| Method     | Endpoint       | Description    |
| :-------   | :---------     | :------------- |
|POST        |/api/roles      |Create role     |
|GET         |/api/roles      |List roles      |
|PUT         |/api/roles/:id  |Update role     |
|DELETE      |/api/roles/:id  |Delete role     |


## Users [`/api/users`]

| Method     | Endpoint                                 | Description         |
| :-------   | :--------------------------------------  | :-------------      |
|POST        |/api/users                                |create a user        |
|GET         |/api/users                                |list all users       |
|GET         | /users/?limit={integer}&offset={integer} |Paginated users      |
|POST        |/api/users/login                          |login a user         |
|GET         |/api/users/:id                            |get a specific user  |
|PUT         |/api/users/:id                            |update a user        |
|DELETE      |/api/users/:id                            |delete a user        |
|GET         |/api/users/:id/documents                  |get user's documents |
|POST        |/api/users/logout                         |logout a user        |


## Documents [`/api/documents`]

| Method     | Endpoint                                        | Description         |
| :-------   | :--------------------------------------------   | :-------------      |
|POST        |/api/documents                                   |create  adocument    |
|GET         |/api/documents                                   |list documents       |
|GET         |/api/documents/?limit={integer}&offset={integer} |Paginated documents  |
|GET         |/api/documents/:id                               |get a document       |
|PUT         |/api/documents/:id                               |update a document    |
|DELETE      |/api/documents/:id                               |delete a document    |


## Search [`/api/search`]

| Method     | Endpoint                            | Description         |
| :-------   | :---------------------------------- | :-------------      |
|GET         |/api/search/users/?q={username}      |Search users         |
|GET         |/api/search/documents/?q={doctitle}  |Search documents     |

