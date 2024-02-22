import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { OrderSchema } from "../models/order-schema";
import { createOrder } from "../adapters/orders-repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    console.log("okokokok")

    const command = OrderSchema.safeParse(JSON.parse(event.body!))

    if (command.success) {
        const item = await createOrder(command.data);

        return {
            statusCode: 200,
            body: JSON.stringify(item)
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            type: "validation-error",
            title: "Command not correct",
            errorDetails: command.error.issues,
        })
    }

}

