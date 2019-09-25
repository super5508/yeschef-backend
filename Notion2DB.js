const keyMaps = {
    dishes: {
        "Name": "name",
        "Code Name": "codeName",
        "ID": "id",
        "PARENT_ID": "parentId",
        "CHEF_ID": "chefId",
        "Tag": "tag",
        "Description": "description",
        "Status": "status",
        "PARENT": "parent",
        "Ed's Backstory": "backstory",
        "LESSON": "lesson",
        "Serving Size": "servingSize",
        "Cusine": "cusine",
        "Dietary": "dietary",
        "Skills": "skills"
    },
    lessons: {
        "Name": "name",
        "Title": "title",
        "Goal": "goal",
        "Theme": "theme",
        "SCENES": "scenes",
        "DISH": "dish",
        "LOCATIONS": "locations",
        "PEOPLE": "people",
        "STORY": "story"
    }
}

const notionKeyToDbKey = (key) => {
    const keyParts = key.toLowerCase().split("_");
    for (let i = 1; i < keyParts.length; i++) {
        keyParts[i] = keyParts[i].charAt(0).toUpperCase() + keyParts[i].substring(1);
    }
    return keyParts.join("");
}

module.exports = {
    keyMaps,
    notionKeyToDbKey
}