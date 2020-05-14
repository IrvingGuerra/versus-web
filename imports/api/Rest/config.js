// Global API configuration
import uploadMiddleware from './upload-middleware';
var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
});


export default Api;