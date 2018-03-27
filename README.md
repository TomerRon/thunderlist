# Thunderlist

Thunderlist is a lightweight Node.js web app for creating and maintaining notes, built with Express and EJS.

Live demo: https://thunderlist.herokuapp.com

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Clone this repository:

```
git clone https://github.com/TomerRon/thunderlist
cd thunderlist
```

Install the required node modules:

```
npm install
```

### Setting it up

Create a file called `.env` in the root folder and set your environment variables:

```

$ touch .env

# .env file in development:
DB_DEVELOPMENT_USERNAME=your-db-username
DB_DEVELOPMENT_DBNAME=your-db-name
PASSPORT_SESSION_SECRET=your-super-secret

# .env file in production:
DB_PRODUCTION_USERNAME=your-db-username
DB_PRODUCTION_PASSWORD=your-db-password
DB_PRODUCTION_DBNAME=your-db-name
DB_PRODUCTION_HOST=your-db-host
PASSPORT_SESSION_SECRET=your-super-secret
```

Make sure you enter correct database information. If you are having trouble, check the `/config/db.js` file.

### Running the tests

```
npm test
```

### Running the app

```
npm start
```

## Built With

* [Node.js](https://nodejs.org)
* [Express](https://expressjs.com/)
* [EJS](http://ejs.co/) view engine
* [Sequelize](https://github.com/sequelize/sequelize) + [Sequelize CLI](https://github.com/sequelize/cli) + MySQL
* [Passport](http://www.passportjs.org/) authentication
* [Mocha](https://mochajs.org/) / [Chai](http://www.chaijs.com/) tests
* [jQuery](https://jquery.com/)

## File structure

```bash
├── config          # config files
│   ├── db.js           # database configuration
│   └── passport.js     # passport configuration (authentication)
├── migrations      # database migrations
├── models          # model definitions for Sequelize
├── public          # public assets
├── test            # Mocha tests
├── views           # EJS view files
├── .env            # environment variables
├── .sequelizerc
├── api.js          # Thunderlist API
├── app.js          # app entry point
├── LICENSE.md
├── package.json
├── README.md
└── routes.js       # web router
```

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.