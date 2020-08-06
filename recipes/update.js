'use strict';

const dynamodb = require('./dynamodb');

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      user_id: event.pathParameters.user_id.replace('%40','@').replace('%2B','+'),
      recipe_id: event.pathParameters.recipe_id
    },
    ExpressionAttributeNames: {
      '#recipe_name': 'name',
      '#recipe_url': 'url'
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':description': data.description,
      ':ingredients': data.ingredients,
      ':directions':data.directions,
      ':image':data.image,
      ':url': data.url,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #recipe_name = :name, description = :description,ingredients = :ingredients,directions = :directions,image = :image, #recipe_url = :url, updatedAt = :updatedAt',
  };

  dynamodb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the todo item.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    };
    callback(null, response);
  });
};
