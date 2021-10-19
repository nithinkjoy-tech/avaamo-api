try:
    import sys
    import spacy
    nlp = spacy.load("en_core_web_sm")
    doc = list(nlp(u"{}".format(sys.argv[1])))
    sent = sys.argv[1]
    store = []
    headerSynonyms = eval(sys.argv[2])
    data = eval(sys.argv[3])
    ele = [0]*len(data)
    
    for aa in range(0,len(doc),2):
        if(aa+1<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])) 
           
    for aa in range(0,len(doc),3):
        if(aa+2<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])+"-"+str(doc[aa+2]))  
          
    for aa in range(0,len(doc),4):
        if(aa+3<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])+"-"+str(doc[aa+2])+"-"+str(doc[aa+3]))    
        
    for aa in range(0,len(doc),5):
        if(aa+4<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])+"-"+str(doc[aa+2])+"-"+str(doc[aa+3])+"-"+str(doc[aa+4]))    
        
    for aa in range(1,len(doc),2):
        if(aa+1<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])) 
           
    for aa in range(1,len(doc),3):
        if(aa+2<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])+"-"+str(doc[aa+2]))  
          
    for aa in range(1,len(doc),4):
        if(aa+3<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])+"-"+str(doc[aa+2])+"-"+str(doc[aa+3]))    
        
    for aa in range(1,len(doc),5):
        if(aa+4<len(doc)):
            doc.append(str(doc[aa])+"-"+str(doc[aa+1])+"-"+str(doc[aa+2])+"-"+str(doc[aa+3])+"-"+str(doc[aa+4]))
    
    for word in doc:
        for item in headerSynonyms:
            key = list(item.keys())[0]
            if(key == str(word)):
                store.append(key)
            for value in list(item.values())[0]:
                if(value == str(word)):
                    store.append(key)

        for item in data:
            for key, value in item.items():
                if(key == str(word)):
                    store.append(key)
                if(value == str(word)):
                    store.append(value)

        for item in data[0]:
            if item in sent:
                store.append(item)

    store = list(set(store))
    # print(store,"str")
    for i, a in enumerate(data):
        for key, value in a.items():
            if(key in store):
                ele[i] += 1
            if(value in store):
                ele[i] += 1

    ans = {}
    max_value = max(ele)
    index1 = None
    indices = [index for index, value in enumerate(ele) if value == max_value]
    if len(indices) > 1:
        index1 = None
    else:
        index1 = ele.index(max(ele))

    if not index1==None:
        for i in store:
            val = data[index1].get(i)
            if val and not val in store:
                ans[i] = val
    else:
        send=[]
        for item in data:
            send.append(list(item.values())[0])    
        print("Include your prefered header in your query:- ",",".join(send))
        
    z=[]
    strng=""
    for key,value in ans.items():
        z.append(f"{key}  {value} ,")

    strng=strng.join(z)
    print(strng[:-1])
except Exception as ex:
    print(ex) 