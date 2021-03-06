# Payment Reminder Application

SheCodes-Africa assessment test - API Infrastructure to handle automated payment reminder.

Payment Services

- Version 1.0.0: 10th June 2022
- Version 1.0.8: 18th June 2022

## Available Scripts

Run `node app.js` or `npm run dev` ( that is,`nodemon`) for a dev server. Navigate to [http://localhost:5000](http://localhost:5000).

Important Note:
The app will automatically reload if you run `nodemon` or `npm run dev` (I have configured this command to help run nodemon as my development server) when you change any of the source files.

The application won't automatically reload if you run `node app.js`, so, ensure to stop the application using `ctrl + c` then re-run `node app.js`

## Controlling the payment reminder Process

1) Want to quit your running Node.js server?

You can always do that by pressing `ctrl + c` in the terminal/ command prompt window where you started your server (i.e. where you ran `node app.js` or `nodemon`).

2) Create a `.env` file and make reference to your database information for the below stated constants so you can 
run this project seamlessly and test the endpoints.

`PORT=*********`

`POSTGRES_PORT=*********`

`POSTGRES_DATABASE=payment-reminder`

`POSTGRES_HOST=localhost`

`POSTGRES_USER=***********`

`POSTGRES_PASSWORD=*********`

`POSTGRES_DIALECT=*********`

`TOKEN_KEY=***************`

NB: The asteriks values are to be supplied by you in relation to your SQL set up in your local machine.

3) To successfully make a request on secured endpoints use `x-access-token` to set your `JWT` 
header before making a request on postman or any other API testing platform.

## Learn More

You can read more about this assessment test on [she-code-africa/SCAMP-Cohort6-Technical-Assessment](https://github.com/she-code-africa/SCAMP-Cohort6-Technical-Assessment/blob/master/intermediate/nodejs.md).

## Documentation

You can read the documentation on [Payment Reminder](http://localhost:5000/api-doc/).
NB: Ensure the development environment is running, so you can have access to the swagger documentation.

Alternatively, see the below documentation made with postman for the 4 collections
1) [Authentication](https://documenter.getpostman.com/view/13595180/UzBmM73C)
2) [Client](https://documenter.getpostman.com/view/13595180/UzBmM73D)
3) [Invoice](https://documenter.getpostman.com/view/13595180/UzBmM73E)
4) [User](https://documenter.getpostman.com/view/13595180/UzBmM77W)
