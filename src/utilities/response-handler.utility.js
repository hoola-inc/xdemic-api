module.exports = app => {
    app.use((req, res, next) => {
        // This middleware throws an error, so Express will go straight to
        // the next error handler
        setImmediate(() => { next(new Error('Woops! route not found...')); });
    });

    app.use((obj, req, res, next) => {
        // Any request to this server will get here, and will send an HTTP
        // response with the error message 'woops'
        // res.status(error.status || 500);
        if(obj instanceof Error) {
            const error = obj;
            return res.status(500).send({
                status: false,
                error: {
                    message: error.message,
                    detail: error
                }
            })
        } else {
            return res.status(200).json({
                status: true,
                data: obj
            })
        }
    })
}
