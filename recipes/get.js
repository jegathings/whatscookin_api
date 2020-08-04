'use strict';

const dynamodb = require('./dynamodb');

module.exports.get = (event, context, callback) => {
  console.log("User id", event.pathParameters);
  console.log("recipe id", event.pathParameters.recipe_id);
  console.log("user_id", event.pathParameters.user_id);
  var params = {
    KeyConditionExpression: 'user_id = :user_id and recipe_id = :recipe_id',
    ExpressionAttributeValues: {
      ':user_id': "jegathings@gmail.com",
      ':recipe_id': event.pathParameters.recipe_id
    },
    TableName: process.env.DYNAMODB_TABLE
  };
  console.log("Here 1");
  console.log("Params", params);
  // fetch todo from the database
  dynamodb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }
    console.log("Here 2");
    console.log("Result", result);
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    };
    console.log("Response", response);
    callback(null, response);
  });
};
