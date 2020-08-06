'use strict';

const dynamodb = require('../recipes/dynamodb');

module.exports.userlist = (event, context, callback) => {
  console.log("Start List List");
  console.log("Table ",process.env.DYNAMODB_TABLE);
  console.log("Decoded User Id", decodeURI(event.pathParameters.user_id));
  console.log("User Id", event.pathParameters.user_id.replace('%40','@').replace('%2B','+'));

  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
        ":user_id": event.pathParameters.user_id.replace('%40','@').replace('%2B','+')
    }
};

  console.log("Params", params);
  // fetch all todos from the database
  dynamodb.scan(params, (error, result) => {
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
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    };
    console.log("Response",response);
    callback(null, response);
  });
};
