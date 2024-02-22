resource "aws_api_gateway_deployment" "order_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
 
  lifecycle {
    create_before_destroy = true
  }

  triggers = {
  redeployment = sha1(jsonencode([
    aws_api_gateway_resource.order_resource,
    aws_api_gateway_method.get_order,
    aws_api_gateway_integration.get_order_integration,
    aws_api_gateway_method.post_order,
    aws_api_gateway_integration.post_order_integration,
  ]))
  }

  depends_on = [
    aws_api_gateway_method.get_order,
    aws_api_gateway_integration.get_order_integration,
    aws_api_gateway_method.post_order,
    aws_api_gateway_integration.post_order_integration,
    ]
}

resource "aws_api_gateway_stage" "order_api_stage" {
  deployment_id = aws_api_gateway_deployment.order_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.order_api.id
  stage_name    = "v1"
}