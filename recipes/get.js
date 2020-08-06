'use strict';

const dynamodb = require('./dynamodb');

module.exports.get = (event, context, callback) => {
  console.log("Start get");

  var params = {
    Key:{
      "user_id":event.pathParameters.user_id.replace('%40','@').replace('%2','+'),
      "recipe_id":event.pathParameters.recipe_id
    },
    TableName: process.env.DYNAMODB_TABLE
  };
  console.log("Params", params);
  dynamodb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }
    console.log("Result", result);
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    };
    console.log("Response", response);
    callback(null, response);
  });
  console.log("End get");
};
