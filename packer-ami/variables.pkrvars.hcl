ssh_username                          = "admin"
instance_type                         = "t2.micro"
default                               = ["392319571849", "130565562325"]
profile                               = "dev"
owners                                = ["amazon"]
source_ami_filter_virtualization_type = "hvm"
source_ami_filter_name                = "debian-12-amd64-*"
source_ami_filter_root_device_type    = "ebs"