import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createOrder } from "../adapters/orders-repository";
import { OrderSchema } from "../models/order-schema";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const command = OrderSchema.safeParse(JSON.parse(event.body!));

  if (command.success) {
    const item = await createOrder(command.data);

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      type: "validation-error",
      title: "Command not correct",
      errorDetails: command.error.issues,
    }),
  };
};
