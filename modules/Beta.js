let esClient;

exports.init = (_esClient) => {
  esClient = _esClient;
}

exports.addBetaInfo = async (req, res) => {
  res.set("Cache-Control", "max-age=86400");
  let response;
  try {
    const addbetaResponse = await esClient.index({
      index: 'beta',
      body: req.body
    });
    response = addbetaResponse;
  } catch (e) {
    const errMsg = "error in adding beta";
    console.warn(errMsg);
    console.warn(e);
    response = errMsg;
    res.status(500);
  }
  res.send(response);
}

exports.getBetaInfo = async (req, res) => {
  console.log('Started');
  const resp = await esClient.index({
    index: 'beta',
    body: {
      title: '',
      subTitle: '',
      cards: [
        {
          createdDate: '',
          title: '',
          content: '',
          hyperlinks: [
            { url: '', text: "" },
            { url: '', text: "" }
          ],
          portfolio: '',
          portfolioDescription: '',
          closeable: false,
          key: '',
        },
      ]
    }
  })
  console.log(resp, '==================');
  res.set("Cache-Control", "max-age=86400");
  let response;
  try {
    const getbetaResponse = await esClient.get({
      index: 'beta',
      id: 0,
    });
  } catch (e) {
    const errMsg = "error in getting beta data";
    console.warn(errMsg);
    console.warn(e);
    response = errMsg;
    res.status(500)
  }
  res.send(response);
}