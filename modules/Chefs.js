const { esClient } = require('./ESImpl/esClientWrapper');

// const init = (_esClient) => {
//     esClient = _esClient;
// }

const getInfo = async (req, res) => {
    res.set("Cache-Control", "max-age=86400");
    let response;
    try {
        const getChefResponse = await esClient.get({
            index: "chefs",
            id: req.params.id
        });

        response = JSON.stringify(getChefResponse.body._source);
    } catch (e) {
        console.warn("error in getting chef's data");
        console.warn(e);
        response = "error in getting chef's data";
        res.status(500)
    }

    res.send(response);
};

module.exports = {
    // init,
    getInfo
}