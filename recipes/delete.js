'use strict';

const dynamodb = require('./dynamodb');

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      user_id: event.pathParameters.user_id.replace('%40','@').replace('%2B','+'),
      recipe_id: event.pathParameters.recipe_id
    },
  };

  dynamodb.delete(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the item.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    };
    callback(null, response);
  });
};
