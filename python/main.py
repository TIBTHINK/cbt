import requests
import json
import time

# Define ASCII art for each digit and comma
ascii_art_digits = {
    '0': [" 000 ",
          "0   0",
          "0   0",
          "0   0",
          "0   0",
          "0   0",
          " 000 ",
          "     "],
    '1': ["  1  ",
          " 11  ",
          "1 1  ",
          "  1  ",
          "  1  ",
          "  1  ",
          "11111",
          "     "],
    '2': [" 222 ",
          "2   2",
          "    2",
          "   2 ",
          "  2  ",
          " 2   ",
          "22222",
          "     "],
    '3': [" 333 ",
          "3   3",
          "    3",
          "  33 ",
          "    3",
          "3   3",
          " 333 ",
          "     "],
    '4': ["   4  ",
          "  44  ",
          " 4 4  ",
          "4  4  ",
          "444444",
          "   4  ",
          "   4  ",
          "     "],
    '5': ["55555",
          "5    ",
          "5    ",
          " 555 ",
          "    5",
          "5   5",
          " 555 ",
          "     "],
    '6': [" 666 ",
          "6    ",
          "6    ",
          "6666 ",
          "6   6",
          "6   6",
          " 666 ",
          "     "],
    '7': ["77777",
          "    7",
          "   7 ",
          "  7  ",
          " 7   ",
          "7    ",
          "7    ",
          "     "],
    '8': [" 888 ",
          "8   8",
          "8   8",
          " 888 ",
          "8   8",
          "8   8",
          " 888 ",
          "     "],
    '9': [" 9999",
          "9   9",
          "9   9",
          " 9999",
          "    9",
          "    9",
          "    9",
          "     "],
    ',': ["    ",
          "    ",
          "    ",
          "    ",
          "    ",
          "  00",
          "  00",
          " 0  "]
}

# Function to convert a number (or string) to ASCII art
def number_to_ascii_art(number):
    # Convert the number to a string if it's not already
    number_str = str(number)
    # Create a list for each row of the ASCII art
    ascii_art_lines = ['' for _ in range(8)]
    # Append each digit's ASCII art to the lines
    for digit in number_str:
        if digit in ascii_art_digits:
            for i, line in enumerate(ascii_art_digits[digit]):
                ascii_art_lines[i] += line + '  '
        else:
            raise ValueError(f"No ASCII art for digit or symbol: {digit}")
    return '\n'.join(ascii_art_lines)

def format_number_with_commas(number_str):
    formatted_number = ""
    for i in range(len(number_str)-1, -1, -1):
        formatted_number = number_str[i] + formatted_number
        if (len(number_str)-i) % 3 == 0 and i != 0:
            formatted_number = "," + formatted_number
    return formatted_number

while True:
    request = requests.get("http://localhost:3001/api")
    output = request.json()
    output_dict = output[0]  # get the first element of the list
    number = output_dict['value']

    # Convert number to string
    number_str = str(number)
    print(number_to_ascii_art(format_number_with_commas(number_str)))
    time.sleep(1)