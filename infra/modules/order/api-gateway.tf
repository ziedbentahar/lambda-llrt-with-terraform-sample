resource "aws_api_gateway_rest_api" "order_api" {
  name = "${var.application}-${var.environment}-api"
}

resource "aws_api_gateway_resource" "order_resource" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  parent_id   = aws_api_gateway_rest_api.order_api.root_resource_id
  path_part   = "order"
}



