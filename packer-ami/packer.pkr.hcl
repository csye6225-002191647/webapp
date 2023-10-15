packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "debian" {
  ami_name      = "debian-12"
  instance_type = "t2.micro"
  ssh_username  = "admin"
  region        = "us-east-1"
  source_ami    = "ami-06db4d78cb1d3bbf9"
  access_key    = "AKIAVWWARS6ERTE4B7X4"
  secret_key    = "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"
}

build {
  sources = [
    "source.amazon-ebs.debian"
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
}

