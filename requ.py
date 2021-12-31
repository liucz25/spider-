import requests
from bs4 import BeautifulSoup
r = requests.get(
    "https://h5.haoyigong.com/vweb/microClass/videoPlay.html?id=3333")
print(r.encoding)
demo = r.text
soup = BeautifulSoup(demo, "html.parser")
print("bs4")
print(soup.prettify("ISO-8859-1"))
print(soup.original_encoding)
tag = soup.h3
print(tag.text)
