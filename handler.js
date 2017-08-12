'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.register = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const uuid = JSON.stringify((Math.floor(Math.random() * (10000 - 1)) + 10000) * timestamp);
  const data = JSON.parse(event.body);

  if (typeof data.name !== 'string' || typeof data.number !== 'string') {
    callback(new Error('Couldn\'t create the new item.'));

    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid,
      name: data.name,
      toNumber: data.number,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      callback(new Error('Couldn\'t create the new item.'));

      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };

    callback(null, response);
  });
};