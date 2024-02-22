import { z } from "zod";

export const OrderItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().min(1),
});

export const OrderSchema = z.object({
  customerName: z.string().min(3).max(20),
  shippingAddress: z.string().min(4),
  items: z.array(OrderItemSchema),
});
