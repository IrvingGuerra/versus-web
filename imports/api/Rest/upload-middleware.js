import {JsonRoutes} from 'meteor/simple:json-routes';
import Busboy from 'busboy';


// images upload middlware (Restivus handle bad this.done() method, so this is workaround)
JsonRoutes.Middleware.use(function (req, res, next) {

    // upload image only on PUT to /users/:id must be presneted authToken and userId header
    if ((req.method === 'PUT' || req.method === 'POST') &&
        req.headers['content-type'].match(/^multipart\/form\-data/)) {

        const busboy = new Busboy({headers: req.headers});

        // files will be avaliable in request context in endpoints
        req.files = [];
        req.data = {};

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            const uploadedFile = {
                filename,
                mimetype,
                encoding,
                fieldname,
                data: null
            };

            //console.log('busboy have file...', uploadedFile);
            const buffers = [];

            file.on('data', function (data) {
                //console.log('data: ', data.length);
                buffers.push(data);
            });
            file.on('end', function () {
                //console.log('EOF');
                uploadedFile.data = Buffer.concat(buffers);
                req.files.push(uploadedFile);
            });
        });

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            req.data[fieldname] = val;
        });

        busboy.on('finish', function () {
            //console.log('busboy finish');
            next();
        });

        req.pipe(busboy);
        return;
    }
    next();
});
