packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

          variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
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

  source_ami_filter {
    owners      = ["amazon"]
    most_recent = true
    filters = {
      virtualization-type = "hvm"
      name                = "debian-12-amd64-*"
      root-device-type    = "ebs"
    }
  }
  ami_users = "${var.ami_users}"
}

build {
  sources = [
    "source.amazon-ebs.debian",
  ]
  provisioner "file" {
    direction   = "upload"
    source      = "./artifacts/webapp.zip"
    destination = "webapp.zip"
  }
  provisioner "file" {
    source      = "demo.sh"
    destination = "~/"
  }
  provisioner "shell" {
    inline = [
      "pwd",
      "ls -a -l",
      "sudo bash ~/demo.sh",

    ]
  }
}
