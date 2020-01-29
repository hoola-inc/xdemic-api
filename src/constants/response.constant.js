exports.SUCCESS = (res, data) => {
    return res.status(200).json({
        status: true,
        data: data
    });
}

exports.GETSUCCESS = (res, data) => {
    return res.status(200).json({
        status: true,
        lenght: data.length,
        data: data
    });
}

exports.AUTHSUCCESS = (res, data, token) => {
    return res.status(200).json({
        status: true,
        token: token,
        data: data
    });
}

exports.NOTFOUND = (res) => {
    return res.status(200).json({
        status: false,
        message: 'no record found'
    });
}