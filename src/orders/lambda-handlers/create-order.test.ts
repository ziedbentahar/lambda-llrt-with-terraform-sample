import {
  DynamoDBClient,
  DynamoDBClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { AwsStub, mockClient } from "aws-sdk-client-mock";
import { handler } from "./create-order";

describe("create order lambda", () => {
  let dynamodbClientMock: AwsStub<
    ServiceInputTypes,
    ServiceOutputTypes,
    DynamoDBClientResolvedConfig
  >;

  beforeEach(() => {
    dynamodbClientMock = mockClient(DynamoDBClient);
  });

  afterEach(() => {
    dynamodbClientMock.reset();
    jest.resetAllMocks();
  });

  test("returns 400 error when provided payload is not a valid order json", async () => {
    const apiGatewayEvent: APIGatewayProxyEvent = {
      body: "{}",
      resource: "/{proxy+}",
      path: "/path/to/resource",
      httpMethod: "GET",
      isBase64Encoded: true,
      queryStringParameters: {
        foo: "bar",
      },
      multiValueQueryStringParameters: {
        foo: ["bar"],
      },
      pathParameters: {
        proxy: "/orders",
      },
      stageVariables: {
        baz: "qux",
      },
      headers: {},
      multiValueHeaders: {},
      requestContext:
        {} as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>,
    };

    // act
    const result = await handler(apiGatewayEvent);

    // assert
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).type).toBe("validation-error");
  });

  test("returns 400 error when provided payload is missing a mandatory order field", async () => {
    const apiGatewayEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        shippingAddress: "knyq",
        items: [
          {
            itemId: "5df14750-ae38-421a-a1fa-5a0bb02c8dfd",
          },
          {
            itemId: "fe835b5c-2ffa-4c85-bff1-090d40fdbbf6",
            quantity: 27.143753011943772,
          },
          {
            itemId: "aa811cc7-d0ae-4f04-a24b-ba734ed1996c",
            quantity: 85.68002999154851,
          },
        ],
      }),
      resource: "/{proxy+}",
      path: "/path/to/resource",
      httpMethod: "GET",
      isBase64Encoded: true,
      queryStringParameters: {
        foo: "bar",
      },
      multiValueQueryStringParameters: {
        foo: ["bar"],
      },
      pathParameters: {
        proxy: "/orders",
      },
      stageVariables: {
        baz: "qux",
      },
      headers: {},
      multiValueHeaders: {},
      requestContext:
        {} as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>,
    };

    // act
    const result = await handler(apiGatewayEvent);

    // assert
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).type).toBe("validation-error");
  });

  test("saves the order and returns 200 when provided payload is a correct order request field", async () => {
    const apiGatewayEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        customerName: "gcuuam-lnfd",
        shippingAddress: "knyq",
        items: [
          {
            itemId: "5df14750-ae38-421a-a1fa-5a0bb02c8dfd",
            quantity: 29.797177969943732,
          },
          {
            itemId: "fe835b5c-2ffa-4c85-bff1-090d40fdbbf6",
            quantity: 27.143753011943772,
          },
          {
            itemId: "aa811cc7-d0ae-4f04-a24b-ba734ed1996c",
            quantity: 85.68002999154851,
          },
        ],
      }),
      resource: "/{proxy+}",
      path: "/path/to/resource",
      httpMethod: "GET",
      isBase64Encoded: true,
      queryStringParameters: {
        foo: "bar",
      },
      multiValueQueryStringParameters: {
        foo: ["bar"],
      },
      pathParameters: {
        proxy: "/orders",
      },
      stageVariables: {
        baz: "qux",
      },
      headers: {},
      multiValueHeaders: {},
      requestContext:
        {} as APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>,
    };

    dynamodbClientMock.on(UpdateItemCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    // act
    const result = await handler(apiGatewayEvent);

    const command = dynamodbClientMock.commandCalls(UpdateItemCommand);

    expect(command.length).toBe(1);

    // assert
    expect(result.statusCode).toBe(200);
  });
});
