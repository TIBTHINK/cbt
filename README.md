# CBT
Version: 1.1.0

## Prerequisites
to use you need to have sudo privileges and docker and docker-compose installed
```sh
sudo apt install docker docker-compose
```


## How to use
Option 1

```sh
sudo bash docker.sh -U
```

Option 2
```sh
sudo docker-compose up -d
```

## Config

going into the src folder you will find a config.json file.

Example:
```json
{
  "config": {
    "title": "CANCEL BEN TSARDOULIAS", //changes the title of the website
    "start_date": "2023-10-29" // when the counter began
  },
  // in charge of the special box's password
  "password": { 
    "OneHundred": "oh come on",
    "TwohundredFifty": "it wasnt that bad",
    "FiveHundred": "you got to be kidding",
    "OneThousand": "wow i must of really fucked up"
  }
}
```

## Using the API
You might be wondering why there is an API, so you can display your achievement in a physical medium Materials 

[Adafruit Matrix Portal S3 CircuitPython Powered Internet Display](https://www.adafruit.com/product/5778)

[64x32 RGB LED Matrix - 4mm pitch](https://www.adafruit.com/product/2278)

Follow [this](https://learn.adafruit.com/adafruit-matrixportal-s3/install-circuitpython) tutorial to install circuit python.

## Programing the board

clone the [git repo](https://github.com/TIBTHINK/cbt_board) and copy the contents into the circutpython folder on your desktop

change the settings.toml file to your network (the board can only use 2.4GHz frequency)

