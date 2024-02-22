output "api_gateway_base_url" {
  value = aws_api_gateway_deployment.order_api_deployment.invoke_url
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.order_api.id
}

