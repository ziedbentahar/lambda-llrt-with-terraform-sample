resource "aws_api_gateway_rest_api" "order_api" {
  name = "${var.application}-${var.environment}-api"
}

resource "aws_api_gateway_resource" "order_resource" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  parent_id   = aws_api_gateway_rest_api.order_api.root_resource_id
  path_part   = "order"
}

resource "aws_api_gateway_method" "options_method_order" {
  rest_api_id   = aws_api_gateway_rest_api.order_api.id
  resource_id   = aws_api_gateway_resource.order_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_method_order_200" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  resource_id = aws_api_gateway_resource.order_resource.id
  http_method = aws_api_gateway_method.options_method_order.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_method.options_method_order]
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  resource_id = aws_api_gateway_resource.order_resource.id
  http_method = aws_api_gateway_method.options_method_order.http_method
  type        = "MOCK"
  depends_on  = [aws_api_gateway_method.options_method_order]
  request_templates = {
    "application/json" = "{ 'statusCode': 200 }"
  }
}
resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  resource_id = aws_api_gateway_resource.order_resource.id
  http_method = aws_api_gateway_method.options_method_order.http_method
  status_code = aws_api_gateway_method_response.options_method_order_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST,GET'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.options_method_order_200]
}

resource "aws_api_gateway_method" "post_method_order" {
  rest_api_id   = aws_api_gateway_rest_api.order_api.id
  resource_id   = aws_api_gateway_resource.order_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "post_method_order_response_200" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  resource_id = aws_api_gateway_resource.order_resource.id
  http_method = aws_api_gateway_method.post_method_order.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on = [aws_api_gateway_method.post_method_order]
}



resource "aws_api_gateway_integration" "post_order_integration" {
  rest_api_id             = aws_api_gateway_rest_api.order_api.id
  resource_id             = aws_api_gateway_resource.order_resource.id
  http_method             = aws_api_gateway_method.post_method_order.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_order_lambda.invoke_arn
}

resource "aws_lambda_permission" "post_order_apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_order_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.id}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.order_api.id}/*/${aws_api_gateway_method.post_method_order.http_method}${aws_api_gateway_resource.order_resource.path}"
}


resource "aws_api_gateway_deployment" "order_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.order_api.id
  triggers = {
    redeployment = filemd5("${path.module}/api-gateway.tf")
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    aws_api_gateway_method.post_method_order,
  aws_api_gateway_integration.post_order_integration]
}

resource "aws_api_gateway_stage" "order_api_stage" {
  deployment_id = aws_api_gateway_deployment.order_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.order_api.id
  stage_name    = "v1"
}

