let esClient;

exports.init = (_esClient) => {
    esClient = _esClient;
}

exports.addFeedback = async (req, res) => {
  res.set("Cache-Control", "max-age=86400");
  let response;
  try {
    const addFeedbackResponse = await esClient.index({
      index: 'feedback',
      body: req.body
    });
    response = addFeedbackResponse;
  } catch (e) {
    const errMsg = "error in adding feedback";
    console.warn(errMsg);
    console.warn(e);
    response = errMsg;
    res.status(500);
  }
  res.send(response);
}

exports.getFeedback = async (req, res) => {
    res.set("Cache-Control", "max-age=86400");
    let response;
    try {
        const getFeedbackResponse = await esClient.get({
            index: 'feedback',
            id: req.params.id
        });
    } catch (e) {
        const errMsg = "error in getting feedback data";
        console.warn(errMsg);
        console.warn(e);
        response = errMsg;
        res.status(500)
    }
    res.send(response);
}