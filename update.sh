
if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root" 1>&2
  exit 1
fi

docker-compose down
git pull
docker-compose up -d
