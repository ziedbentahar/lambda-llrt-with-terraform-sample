variable "application" {
  type = string
}

variable "environment" {
  type = string
}

variable "get_order_lambda" {
  type = object({
    name = string
    dist_dir = string,
    handler  = string
  })
}

variable "create_order_lambda" {
  type = object({
    name = string
    dist_dir = string,
    handler  = string
  })
}
