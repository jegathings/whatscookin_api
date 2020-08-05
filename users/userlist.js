'use strict';

const dynamodb = require('../recipes/dynamodb');

module.exports.userlist = (event, context, callback) => {
  console.log("Start List");
  console.log("Table ",process.env.DYNAMODB_TABLE);
  console.log("User Id", event.pathParameters.user_id);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    user_id:event.pathParameters.user_id
  };

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

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
