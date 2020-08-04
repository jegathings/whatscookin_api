'use strict';

const uuid = require('uuid');
const dynamodb = require('./dynamodb');

module.exports.create = (event, context, callback) => {
		console.log("Inside create.");
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    console.log("Body", data);
    console.log("Id", event.requestContext.identity.cognitoIdentityId);
    console.log("DB Name", process.env.DYNAMODB_TABLE);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        user_id: data.email,
        recipe_id: uuid.v1(),
        name: data.name,
        description: data.description,
        ingredients: data.ingredients,
        image: data.image,
        url: data.url,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
    console.log("About to insert.");
    console.log("Params", params);
    // write the todo to the database
    dynamodb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the todo item.',
        });
        return;
      }
      console.log("Created ",params.Item);
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
      };
      callback(null, response);
    });    
};
