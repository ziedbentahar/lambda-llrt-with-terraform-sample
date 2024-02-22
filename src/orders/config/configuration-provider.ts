export const config = {
  getOrderTableName: () => {
    return process.env.ORDERS_TABLE_NAME;
  },
};
