import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { config } from "../config/configuration-provider";
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderPayload } from "orders/models/order";


const ddbClient = new DynamoDBClient({});

const getOrder = async (id: string): Promise<Order | null> => {

  const result = await ddbClient.send(new GetItemCommand({
    Key: { id: { S: id } },
    TableName: config.getOrderTableName()
  }));

  if (result?.Item == null) {
    return null;
  }


  const data = JSON.parse(result.Item.data.S!) as OrderPayload;

  return { id, ...data };
}

const createOrder = async (order: OrderPayload): Promise<Order> => {
  const id = uuidv4();
  const result = await ddbClient.send(new UpdateItemCommand({
    TableName: config.getOrderTableName(),
    Key: {
      "PK": {
        "S": id
      }
    },
    UpdateExpression: `
      SET 
        #data = :data`,
    ExpressionAttributeValues: {
      ":data": {
        "S": JSON.stringify(order)
      },
    },
    ExpressionAttributeNames: {
      "#data": "data",
    }
  }));

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`Error creating item of id`, {
      cause: result.$metadata
    });
  }

  return {
    id,
    ...order
  }
}

export {
  getOrder,
  createOrder
}