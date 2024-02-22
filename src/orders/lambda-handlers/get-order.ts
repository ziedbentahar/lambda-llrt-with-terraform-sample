import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getOrder } from "../adapters/orders-repository";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const id = event.queryStringParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    type: "missing-id",
                    title: "Your request parameters didn't validate.",
                    "invalid-params": [{
                        "name": "id",
                        "reason": "must be a defined"
                    }]
                }
            )
        }
    }


    const cr = await getOrder(id);

    if (!cr) {
        return {
            statusCode: 404,
            body: JSON.stringify(
                {
                    type: "not-found",
                    title: "Element not found",
                }
            )
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(cr)
    }

};




