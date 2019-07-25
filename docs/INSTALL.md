### Installation instructions for development invironment:

1. Make sure you have installed Node.js, NPM, Mongo, MySQL.

2. Clone repository.

3. Install all necessary NPM packages:

   `$ npm install`

4. Copy `.env.example` file to `.env` andd file all properties.

5. Run Push System in development mode with hot reload

   `$ npm run watch`

### Start locallly using Docker:

1. Build image:

   `docker build -t notificator .`

2. Run image

   `sudo docker run --net="host" -p 3000:3000 push-system`
