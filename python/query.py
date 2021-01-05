try:
    import sys
    import spacy
    import json
    import ast 
    nlp = spacy.load("en_core_web_sm")
    doc = list(nlp(u"{}".format(sys.argv[1])))
    store = []
    headerSynonyms = eval(sys.argv[2])
    data = eval(sys.argv[3])
    print(data)
    for word in doc:
        for item in headerSynonyms:
            key = list(item.keys())[0]
            if(key == str(word)):
                store.append(key)
            for value in list(item.values())[0]:
                if(value == str(word)):
                    store.append(key)
    for item in data:
        print(item.keys())
    # key=list(item.keys())
    # value=item.values()
    # for a in key:
    #     if(a==str(word)):
    #         store.append(key)
    #     for value in list(item.values())[0]:
    #         if(value==str(word)):
    #             store.append(key)

    # print(store)

except Exception as ex:
    print(ex)
