from datetime import datetime


def make_json(obj):
    if isinstance(obj, dict):
        return {make_json(k): make_json(v) for k, v in obj.items()}
    elif isinstance(obj, tuple):
        return "|".join(map(str, obj))
    elif isinstance(obj, list):
        return [make_json(i) for i in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj


def getData(connection ,MDX):
    cubeName = MDX.split("FROM",1)[1].split("]",1)[0].strip()[1:]
    dimensions = connection.cubes.get_dimension_names(cubeName)
    data = connection.cubes.cells.execute_mdx(MDX)

    dataDict = {
    "|".join(
        item.split("[")[-1].rstrip("]")
        for item in k
    ) if isinstance(k, tuple) else str(k): v["Value"]
    for k, v in data.items()
}
    dataJson = make_json(dataDict)

    return dimensions ,dataJson    



def reverse_key(key):
    return tuple(key.split("|"))


def setData(connection, MDX, jsonData):
    cubeName = MDX.split("FROM",1)[1].split("]",1)[0].strip()[1:]
    
    tm1_dict = {
        tuple(k.split("|")): v
        for k, v in jsonData.items()
    }
    status = ""
    try:
        connection.cubes.cells.write(cubeName, tm1_dict ,skip_non_updateable=True)
        status = "success"
    except e:
        print(e)
        status = "faild"
    return status ,cubeName
