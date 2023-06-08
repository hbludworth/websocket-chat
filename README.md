# Firebase Authentication Example

This repository is home to a simple template for adding Firebase Authentication to your own projects. It is a fullstack app built with Vue, Node.js, Express, MongoDB, and TypeScript.

On top of the essential authentication code, this app also includes support for frontend navigation guards, restricted API routes, and administrator privilege restrictions. The frontend app allows for simple API and navigation tests to be run to understand how the Firebase Authentication system works in this project. Much of the code here will not be used in your app and is only for demonstration purposes. However, the basic structure needed for Firebase Authentication has been implemented and can be used as needed.

More information on usage can be found on the [live demonstration site.](https://auth.harrisonbludworth.com)

## Implementing the Template

As mentioned above, much of the code available in the project can be referenced, copied, or otherwise used to create your own implementation of a Firebase Authentication system in your own project. Below I will outline how to run the project locally, but will not give details on what adjustments you may need to make for your own project. The guide below operates under the assumption that you already know how to create a MongoDB database, know how to load private environment variables, and have already created a Firebase project.

### Preparation

Before you can run the project locally, there are a few things you need to do. As indicated above, in order to run the project yourself, you will need a MongoDB database and an open Firebase project.

First, you must add your public Firebase configuration object to the frontend code. This can be found at `/packages/frontend/src/firebase.ts`. This will allow for your frontend app to properly manage user sessions, refresh tokens, etc.

Next, you must provide the backend code with your private Firebase configuration JSON file. This should be done in a way that keeps the code private so that it is not committed to a publicly-accessible repository. This can be added to the backend firebase configuration file found at `/packages/backend/src/firebase.ts`. In the template, I have opted to store the private JSON file in a private AWS S3 bucket. It is retrieved by the server on startup using the command line's current AWS profile. You can choose to implement the private JSON configuration object however you wish.

Finally, you must add connection details for your MongoDB database. In the file found at `/packages/backend/src/connection.ts` you can see that the MongoDB username, password, and hostname are accessed via environment variables. For your purposes, make sure to provide environment variables using `.env` files or some other method. These details should be kept private.

Once these adjustments have been made, you are ready to run your own local version of the template application.

### Running the Project

Now that you have everything configured, running the project is easy.

First, run `yarn install` to download all necessary packages.

Next, simply run `yarn start`. This will serve both the frontend Vue 3 app and the backend Node.js + Express server. Both servers will be hot-reloaded when changes are made.

### Building for Production

Should you wish to build the project and deploy to production, the process is extremely easy.

First, run `yarn build` to build the TypeScript types, the Vue app, and the Node.js server files.

Next, run `yarn zip`. This will create a zip file containing all of the code necessary to run in production, including all necessary node modules.

Simply deploy the zip file to your hosting provider of choice and you should see the production version of the app.
