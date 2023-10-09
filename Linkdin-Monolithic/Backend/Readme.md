http://localhost:8000/user/register
{
  "email":"bsse1221@iit.du.ac.bd",
  "password":"1234"
}

http://localhost:8000/user/login
{
  "email":"bsse1221@iit.du.ac.bd",
  "password":"1234"
}

http://localhost:8000/user/dashboard


Minio server start 
sudo MINIO_ROOT_USER=admin MINIO_ROOT_PASSWORD=password ./minio server /mnt/data --console-address ":9001"

sudo MINIO_ROOT_USER=admin MINIO_ROOT_PASSWORD=password minio server ~/minio --console-address :9001

mc policy set download admin/linkdin-post-images
http://localhost:9000/linkdin-post-images/1690053213331-Sifat.jpg

