import { z } from "zod";
import { OrderSchema } from "./order-schema";

export type OrderPayload = z.infer<typeof OrderSchema>;

export type Order = { id: string } & OrderPayload;
