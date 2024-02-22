module "order" {
  source = "./modules/order"

  get_order_lambda = {
    name     = "get-order"
    dist_dir = "../src/dist/orders/lambda-handlers"
    handler  = "get-order.handler"
  }

  create_order_lambda = {
    name     = "create-order"
    dist_dir = "../src/dist/orders/lambda-handlers"
    handler  = "create-order.handler"
  }

  application = var.application
  environment = var.environment
}





