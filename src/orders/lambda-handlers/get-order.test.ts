import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { APIGatewayEventDefaultAuthorizerContext, APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyEvent, SQSEvent } from 'aws-lambda';
import { DynamoDBClient, DynamoDBClientResolvedConfig, GetItemCommand, ServiceInputTypes, ServiceOutputTypes } from '@aws-sdk/client-dynamodb';
import { handler } from './get-order';

describe('get order lambda', () => {

    let dynamodbClientMock: AwsStub<ServiceInputTypes, ServiceOutputTypes, DynamoDBClientResolvedConfig>;

    beforeEach(() => {
        dynamodbClientMock = mockClient(DynamoDBClient);
    })


    afterEach(() => {
        dynamodbClientMock.reset();
        jest.resetAllMocks();
    });

    test('returns 400 error when order id is missing from query string parameters', async () => {
        const apiGatewayEvent: APIGatewayProxyEvent = {
            "body": "eyJ0ZXN0IjoiYm9keSJ9",
            "resource": "/{proxy+}",
            "path": "/path/to/resource",
            "httpMethod": "GET",
            "isBase64Encoded": true,
            "queryStringParameters": {
                "foo": "bar"
            },
            "multiValueQueryStringParameters": {
                "foo": [
                    "bar"
                ]
            },
            "pathParameters": {
                "proxy": "/orders"
            },
            "stageVariables": {
                "baz": "qux"
            },
            "headers": {
            },
            "multiValueHeaders": {
            },
            "requestContext": {
            } as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>
        };

        // act
        const result = await handler(apiGatewayEvent);

        // assert
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body).type).toBe("missing-id");

    });

    test('returns 404 error when order is not found on orders repository', async () => {
        const apiGatewayEvent: APIGatewayProxyEvent = {
            "body": "eyJ0ZXN0IjoiYm9keSJ9",
            "resource": "/{proxy+}",
            "path": "/path/to/resource",
            "httpMethod": "GET",
            "isBase64Encoded": true,
            "queryStringParameters": {
                "id": "42"
            },
            "multiValueQueryStringParameters": {
                "foo": [
                    "bar"
                ]
            },
            "pathParameters": {
                "proxy": "/orders"
            },
            "stageVariables": {
                "baz": "qux"
            },
            "headers": {
            },
            "multiValueHeaders": {
            },
            "requestContext": {
            } as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>
        };

        dynamodbClientMock
            .on(GetItemCommand)
            .resolves({
                $metadata: {
                    httpStatusCode: 200
                },
                Item: undefined
            });

        // act
        const result = await handler(apiGatewayEvent);

        // assert
        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body).type).toBe("not-found");

    });

    test('returns 200 with a order in response body when an order is found on orders repository', async () => {
        const apiGatewayEvent: APIGatewayProxyEvent = {
            "body": "eyJ0ZXN0IjoiYm9keSJ9",
            "resource": "/{proxy+}",
            "path": "/path/to/resource",
            "httpMethod": "GET",
            "isBase64Encoded": true,
            "queryStringParameters": {
                "id": "42"
            },
            "multiValueQueryStringParameters": {
                "foo": [
                    "bar"
                ]
            },
            "pathParameters": {
                "proxy": "/orders"
            },
            "stageVariables": {
                "baz": "qux"
            },
            "headers": {
            },
            "multiValueHeaders": {
            },
            "requestContext": {
            } as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>
        };

        dynamodbClientMock
            .on(GetItemCommand)
            .resolves({
                $metadata: {
                    httpStatusCode: 200
                },
                Item: {
                    id: { S: "42" },
                    data: {
                        S: JSON.stringify({
                            "customerName": "gcuuam-lnfd",
                            "shippingAddress": "knyq",
                            "items": [
                                {
                                    "itemId": "5df14750-ae38-421a-a1fa-5a0bb02c8dfd",
                                    "quantity": 29.797177969943732
                                },
                                {
                                    "itemId": "fe835b5c-2ffa-4c85-bff1-090d40fdbbf6",
                                    "quantity": 27.143753011943772
                                },
                                {
                                    "itemId": "aa811cc7-d0ae-4f04-a24b-ba734ed1996c",
                                    "quantity": 85.68002999154851
                                }
                            ]
                        })
                    }
                }
            });

        // act
        const result = await handler(apiGatewayEvent);

        // assert
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toMatchObject({
            id: "42",
            "customerName": "gcuuam-lnfd",
            "shippingAddress": "knyq",
            "items": [
                {
                    "itemId": "5df14750-ae38-421a-a1fa-5a0bb02c8dfd",
                    "quantity": 29.797177969943732
                },
                {
                    "itemId": "fe835b5c-2ffa-4c85-bff1-090d40fdbbf6",
                    "quantity": 27.143753011943772
                },
                {
                    "itemId": "aa811cc7-d0ae-4f04-a24b-ba734ed1996c",
                    "quantity": 85.68002999154851
                }
            ]
        });

    });

});