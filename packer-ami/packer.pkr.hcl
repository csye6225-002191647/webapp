packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ami_users" {
  type    = list(string)
  default = ["392319571849", "130565562325"]
}

source "amazon-ebs" "debian" {
  profile       = "dev"
  ami_name      = "debian_12_${formatdate("YYYY_MM_DD_HH_mm_ss", timestamp())}"
  instance_type = "${var.instance_type}"
  ssh_username  = "${var.ssh_username}"
  region        = "${var.aws_region}"
  source_ami    = "${var.source_ami}"
  ami_users     = "${var.ami_users}"
}

build {
  sources = [
    "source.amazon-ebs.debian",
  ]
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt update",
      "sudo apt upgrade -y",
      "export PGDATABASE=postgres PGUSER=postgres PGPASSWORD=postgres PGPORT=5432 PGHOST=localhost",
      "sudo apt install -y postgresql postgresql-contrib",
      "sudo systemctl start postgresql",
      "sudo systemctl enable postgresql",
      "sudo apt install -y nodejs",
      "sudo apt install -y npm",
      "nodejs -v",
      "sudo -u postgres psql -c \"ALTER USER postgres WITH PASSWORD 'postgres';\"",
      "sudo -u postgres psql -c \"CREATE USER jarvis WITH PASSWORD 'postgres';\"",
      "sudo -u postgres psql -c \"CREATE DATABASE jarvis;\"",
      "sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE \\\"jarvis\\\" to \\\"jarvis\\\";\"",
    ]
  }
  provisioner "file" {
    direction   = "upload"
    source      = "./artifacts/webapp.zip"
    destination = "webapp.zip"
  }
}
