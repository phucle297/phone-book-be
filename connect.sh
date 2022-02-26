scp -i src/models/phone-book.pem  .env ubuntu@ec2-3-1-167-159.ap-southeast-1.compute.amazonaws.com:~
scp -i src/models/phone-book.pem  deploy.sh ubuntu@ec2-3-1-167-159.ap-southeast-1.compute.amazonaws.com:~
scp -i src/models/phone-book.pem  src/models/phone-book.pem ubuntu@ec2-3-1-167-159.ap-southeast-1.compute.amazonaws.com:~
# Connect to ec2
ssh -i src/models/phone-book.pem ubuntu@ec2-3-1-167-159.ap-southeast-1.compute.amazonaws.com