import requests
from bs4 import BeautifulSoup
import sys
from pathlib import Path


path = Path(r"{}".format(sys.argv[2]))
url = sys.argv[1]
contents = ""
if url:
    response = requests.get(url)
    contents = response.text
else:
    with open(path, 'r') as f:
        contents = f.read()

soup = BeautifulSoup(contents, "html.parser")
table = soup.find_all("table")
tbody = ""
if url:
    tbody = table[7].find("tbody")
else:
    tbody = table[0].find("tbody")
tr = tbody.find_all("tr")
th = tr[0].find_all("th")

data = {}
result = []
thdata = []
tr.pop(0)
for item in th:
    thdata.append(item.get_text())

for i in range(len(tr)):
    th = tr[i].find_all(["th", "td"])
    for (key, value) in zip(thdata, th):
        data[key] = value.get_text()
    result.append(data)
    data = {}
print(result)


sys.stdout.flush()
