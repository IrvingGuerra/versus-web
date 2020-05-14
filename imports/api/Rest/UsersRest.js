import Api from "./config";
import FileOperations from "../../startup/server/FileOperations";

Api.addRoute('getUserThumbnail/:idUser', {
    get: function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing or user not found"
            },
            headers: {}
        };
        let user = Meteor.users.findOne(this.urlParams.idUser);
        if (user) {
            let file = null;
            let filename = `${user.username}_thumb.jpg`;
            try {
                file = FileOperations.getFile(user.profile.path + "/" + filename);
                responseMessage.statusCode = 200;
                responseMessage.body = file.data;
                responseMessage.headers["Content-disposition"] = "filename=" + filename;
                responseMessage.headers["Content-length"] = file.data.length;
                responseMessage.headers["Content-Type"] = file.meta.mime;
            } catch (error) {
                console.error("Thumbnail not found ");
                responseMessage.statusCode = 302;
                responseMessage.headers["Content-Type"] = 'text/plain';
                responseMessage.headers["Location"] = '/img/user.png';
                responseMessage.body = 'Location: /img/user.png';
            }
        }
        return responseMessage;
    }
});

Api.addRoute('getUserPhoto/:idUser', {
    get: function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing or user not found"
            },
            headers: {}
        };
        let user = Meteor.users.findOne(this.urlParams.idUser);
        if (user) {
            let file = null;
            let filename = `${user.username}.jpg`;
            try {
                file = FileOperations.getFile(user.profile.path + "/" + filename);
                responseMessage.statusCode = 200;
                responseMessage.body = file.data;
                responseMessage.headers["Content-disposition"] = "filename=" + filename;
                responseMessage.headers["Content-length"] = file.data.length;
                responseMessage.headers["Content-Type"] = file.meta.mime;
            } catch (error) {
                console.error("Thumbnail not found ");
                responseMessage.statusCode = 302;
                responseMessage.headers["Content-Type"] = 'text/plain';
                responseMessage.headers["Location"] = '/img/user.png';
                responseMessage.body = 'Location: /img/user.png';
            }
        }
        return responseMessage;
    }
});

Api.addRoute('testUploadFile', {
    get: function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing"
            },
            headers: {}
        };
        let file = null;
        let filename = this.queryParams.filename;
        if (filename) {
            try {
                file = FileOperations.getFile("testFiles/" + filename);
                responseMessage.statusCode = 200;
                responseMessage.body = file.data;
                responseMessage.headers["Content-disposition"] = "filename=" + filename;
                responseMessage.headers["Content-length"] = file.data.length;
                responseMessage.headers["Content-Type"] = file.meta.mime;
            } catch (error) {
                console.error("Error during get the file: ", error);
                responseMessage.statusCode = 500;
                responseMessage.body = {
                    message: "Error during get the file"
                }
            }
        }
        return responseMessage
    },
    post: function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing"
            }
        };
        console.log("User id: ", this.userId);
        console.log("Url params: ", this.urlParams);
        console.log("Query params: ", this.queryParams);
        console.log("Body params: ", this.bodyParams);
        console.log("FormData: ", this.request.data);
        console.log("FormData Files: ", this.request.files);
        if (this.request.files.length > 0) {
            let file = this.request.files[0];
            try {
                let successSavedFile = FileOperations.saveFile(file.data, file.filename, "testFiles");
                if (successSavedFile) {
                    console.log("Finished file saved");
                    responseMessage.statusCode = 201;
                    responseMessage.body.message = "File saved!";
                } else {
                    responseMessage.statusCode = 500;
                    responseMessage.body.message = "Error saving file";
                }
            } catch (e) {
                console.error("Error saving file: ", e);
                responseMessage = {
                    statusCode: 500,
                    body: {
                        message: "Error saving file",
                        details: e
                    }
                };
            }
        }
        return responseMessage;
    },
});