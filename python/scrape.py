try:
    import requests
    from bs4 import BeautifulSoup
    import sys
    from pathlib import Path
    import spacy
    from itertools import chain
    from nltk.corpus import wordnet

    finalResult=[]
    path = Path(r"{}".format(sys.argv[2]))
    url = sys.argv[1]
    contents = ""
    if url:
        response = requests.get(url,allow_redirects=False)
        if(response.is_redirect):
            raise Exception("The given link is protected")
        contents = response.text
    else:
        with open(path, 'r') as f:
            contents = f.read()

    soup = BeautifulSoup(contents, "html.parser")
    table = soup.find_all("table")
    if not table:
        if(url):
            raise Exception('There is no table available in the given link')
        else:
            raise Exception('There is no table available in the uploaded file')
    
    if url:
        tbody = table[0].find("tbody")
        thead=table[0].find("thead")
    else:
        thead=table[0].find("thead")
        
    if(thead):
        theadtr=thead.find("tr")
        if(theadtr):
            thead=theadtr.find_all(["th","td"])
        else:
            thead=thead.find_all(["th","td"])
    else:
        thead=table[0].find("tr").find_all(["th","td"]) 
                
                
    tbody = table[0].find("tbody")
    if(tbody):
        tbody=tbody.find_all("tr")
    else:
        tbody=table[0].find_all("tr")
        tbody.pop(0)        
                   
    tr=tbody
    if(thead):
        th=thead
    else:
        th=tr[0].find_all("th")
        
    data = {}
    abc={}
    test=[]
    result = []
    thdata = []
    if(not thead):
        tr.pop(0)     
        
    for item in th:
        thdata.append(item.get_text(strip=True).strip("\n"))

    for index,val in enumerate(tr):
        if(len(val.find_all(["td"]))<len(th)-1):
            tr.pop(index)

    for i in range(len(tr)):
        th = tr[i].find_all(["th", "td"])
        for (key, value) in zip(thdata, th):
            data[key] = value.get_text(strip=True).strip("\n")
        result.append(data)
        data = {}
    

    finalResult.append(result)

    json=result[0]
    arr=[]
    token=list(json.keys())
    for a in token:
        synonyms = wordnet.synsets(a)
        lemmas = list(set(chain.from_iterable([word.lemma_names() for word in synonyms])))
        arr.append(lemmas)
    for i in range(len(token)):
        data[token[i]]=arr[i]
        test.append(data)
        data={}
    finalResult.append(test)
    print(finalResult)

    sys.stdout.flush()
except Exception as error:
    print("null",error)