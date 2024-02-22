resource "aws_iam_role" "get_order" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_policy" "get_order" {
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = ["arn:aws:logs:*:*:*"]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem"
        ]
        Resource = ["${aws_dynamodb_table.order_table.arn}"]
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "get_order" {
  role       = aws_iam_role.get_order.name
  policy_arn = aws_iam_policy.get_order.arn
}

data "archive_file" "get_order_lambda_zip" {
  type        = "zip"
  source_dir  = var.get_order_lambda.dist_dir
  output_path = "${path.root}/.terraform/tmp/lambda-dist-zips/${var.get_order_lambda.name}.zip"
}

resource "aws_lambda_function" "get_order_lambda" {
  function_name    = "${var.application}-${var.environment}-${var.get_order_lambda.name}"
  filename         = data.archive_file.get_order_lambda_zip.output_path
  role             = aws_iam_role.get_order.arn
  handler          = var.get_order_lambda.handler
  source_code_hash = filebase64sha256("${data.archive_file.get_order_lambda_zip.output_path}")
  runtime          = "provided.al2023"
  memory_size      = "128"
  architectures    = ["arm64"]

  environment {
    variables = {
      ORDERS_TABLE_NAME = aws_dynamodb_table.order_table.name
    }
  }
}

resource "aws_cloudwatch_log_group" "get_order_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.get_order_lambda.function_name}"
  retention_in_days = "3"
}
