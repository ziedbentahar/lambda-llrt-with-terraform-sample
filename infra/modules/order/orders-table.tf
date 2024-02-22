resource "aws_dynamodb_table" "order_table" {
  name         = "${var.application}-${var.environment}-orders-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"

  attribute {
    name = "PK"
    type = "S"
  }
}



