module.exports = app => {
    app.use((req, res, next) => {
        // This middleware throws an error, so Express will go straight to
        // the next error handler
        setImmediate(() => { next(new Error('Woops! route not found...')); });
    });

    app.use((error, req, res, next) => {
        // Any request to this server will get here, and will send an HTTP
        // response with the error message 'woops'
        // res.status(error.status || 500);
        return res.status(500).send({
            status: false,
            error: {
                message: error.message,
                detail: error
            }
        })
    })
}


// //controller
// const createUser = async (req,res) =>
// {
// try
// {
//   await checkMessageValidity(req);
//   const userType = await checkUserType(req);

  
// }
// catch(error)
// {
//     res.send({error:error});
// }
// }

// //helper
// const checkMessageValidity = async(req,res) =>{
//     try {
//         //if all good
        
//         //if something is wrong
//         throw new Error('MESSAGE SENDING LIMIT EXCEEDED');
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// //helper
// const checkUserType = async(req,res) =>{
//     try {
//         //if all good
        
//         //if something is wrong
//         throw new Error('Unauthorized operation');
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }
