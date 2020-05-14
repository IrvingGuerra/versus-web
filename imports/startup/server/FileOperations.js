import {Meteor} from "meteor/meteor";
import fs from "fs-extra";
import thumbnail from "node-thumbnail";
import FileType from "file-type";
import detect from "detect-file-type";

if (Meteor.isDevelopment) {
    if (Meteor.settings.private && Meteor.settings.private.STORAGE_PATH) {
        process.env.STORAGE_PATH = Meteor.settings.private.STORAGE_PATH;
    } else {
        console.warn('[Scaffold Meteor + Vue] - DEFAULT STORAGE CONFIGURATION IS ACTIVE. ');
    }
}

export default {
    path_upload_files: process.env.STORAGE_PATH,
    PATH_USER_FILE: "users/",

    getCommonExtensionOfFilename(filename) {
        let extIndex = filename.length - 3;
        return filename.substring(extIndex, filename.length);
    },
    getFilenameWithoutExtension(filename) {
        let filenameWithoutExtension = '';
        if (filename.includes(".") && filename.length > 0) {
            filenameWithoutExtension = filename.split(".")[0];
        } else {
            filenameWithoutExtension = filename;
        }
        return filenameWithoutExtension;
    },
    /**
     * Saves a file in the private directory.
     * @param blob
     * @param name
     * @param path
     * @param encoding
     */
    saveFile(blob, name, path) {

        let success = false;
        let encoding = 'binary';
        let chroot = this.path_upload_files;
        path = chroot + (path ? `/${path}` : '');

        fs.ensureDirSync(path);
        let writeFileSync = Meteor.wrapAsync(fs.writeFile);
        try {
            writeFileSync(`${path}/${name}`, blob, encoding);
            success = true;
        } catch (error) {
            console.error("There was an error during saving the file: ", error);
        }
        return success;
    },
    getFile(path) {
        const buffer = fs.readFileSync(this.path_upload_files + "/" + path);
        let syncFromFile = Meteor.wrapAsync(detect.fromFile);
        let mime = syncFromFile(this.path_upload_files + "/" + path);
        return {data: buffer, meta: mime};
    },
    /**
     * Saves a file in the private directory
     * @param base64file
     * @param name
     * @param path
     * @returns {Promise<any>}
     */
    async saveFileFromBase64(base64file, name, path) {
        let errorPromise;
        let encoding = 'base64';
        let chroot = this.path_upload_files;
        path = chroot + (path ? `/${path}` : '');

        fs.ensureDirSync(path);

        errorPromise = new Promise(resolve => {
            fs.writeFile(`${path}/${name}`, base64file, encoding, (err) => {
                if (err) {
                    resolve(`Failed to save file: ${err}`);
                } else {
                    resolve(0);
                }
            });
        });
        await errorPromise;
        return errorPromise;
    },
    /**
     * Remove a file or directory synchronously.
     * @param path
     */
    remove(path) {
        if (path) {
            let chroot = this.path_upload_files;
            path = `${chroot}/${path}`;
            fs.removeSync(path);
        }
    },
    /**
     * Load a file, returns false if the asset doesn't exist.
     * @param path
     * @returns {string|boolean}
     */
    loadAsset(path) {
        let result;
        try {
            const buffer = fs.readFileSync(this.path_upload_files + "/" + path, "base64");
            const magicNumber = buffer.toString('hex', 0, 4);
            const base64String = buffer.toString('base64');
            let type = 'jpeg';
            //check for other formats... here is a table: https://asecuritysite.com/forensics/magic
            if (magicNumber === 'ffd8ffe0') {
                type = 'jpeg';
            } else {
                type = 'png';
            }
            result = `data:image/${type};base64,${base64String}`;
        } catch (e) {
            result = false;
        }
        return result;
    },
    /**
     * Obtiene un archivo
     * @param path
     * @returns {boolean}
     */
    loadAudio(path) {
        let result;
        try {
            const buffer = fs.readFileSync(this.path_upload_files + "/" + path, "base64");
            const base64String = buffer.toString('base64');
            //check for other formats... here is a table: https://asecuritysite.com/forensics/magic
            let extIndex = path.length - 3;
            let type = path.substring(extIndex, path.length);
            result = `data:audio/${type};base64,${base64String}`;
        } catch (e) {
            result = false;
        }
        return result;
    },
    /**
     * Load a thumbnail.
     * @param path
     * @param name
     * @returns {Promise<void>}
     */
    async createThumbnail(path, name) {
        let chroot = this.path_upload_files;
        path = chroot + (path ? `/${path}` : '');
        //let thumb = Npm.require('node-thumbnail').thumb;
        let thumb = thumbnail.thumb;

        await new Promise(resolve => {
            thumb({
                source: `${path}/${name}`, // could be a filename: dest/path/image.jpg
                destination: path,
                width: 50,
                logger(message) {
                    console.log(message);
                }
            }).then((response) => {
                resolve(false);
            }).catch((e) => {
                resolve(e.toString());
            });
        });
    },
    /**
     * Update a thumbnail
     * @param path
     * @param name
     * @returns {Promise<void>}
     */
    async updateThumbnail(path, name) {
        this.remove(`${path}/${this.getFilenameWithoutExtension(name)}_thumb.${this.getCommonExtensionOfFilename(name)}`);
        let chroot = this.path_upload_files;
        path = chroot + (path ? `/${path}` : '');
        let thumb = thumbnail.thumb;
        await new Promise(resolve => {
            thumb({
                source: `${path}/${name}`, // could be a filename: dest/path/image.jpg
                destination: path,
                width: 50,
                logger(message) {
                    console.log(message);
                }
            }).then((response) => {
                resolve(false);
            }).catch((e) => {
                resolve(e.toString());
            });
        });
    },
    existsUserDirectory(dirname) {
        return fs.existsSync(this.path_upload_files + '/' + this.PATH_USER_FILE + dirname);
    },
    async updateUserFoldername(oldFoldername, newFoldername) {
        let isSuccess = false;
        if (fs.existsSync(this.path_upload_files + '/' + this.PATH_USER_FILE + oldFoldername)) {
            isSuccess = await new Promise(resolve => {
                fs.rename(this.path_upload_files + '/' + this.PATH_USER_FILE + oldFoldername,
                    this.path_upload_files + '/' + this.PATH_USER_FILE + newFoldername, (error) => {
                        if (error) {
                            console.error(`Failed to rename folder: ${error}`);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
            });
        }
        return isSuccess;
    },

    async updateLogoAndThumbnailNamesOfUser(oldName, newName, pathUser) {
        let isSuccess = false;
        let isSuccessLogo = false;
        let isSuccessThumbnail = false;
        if (fs.existsSync(this.path_upload_files + '/' + pathUser + '/' + oldName) &&
            fs.existsSync(this.path_upload_files + '/' + pathUser + '/' + this.getFilenameWithoutExtension(oldName)
                + "_thumb." + this.getCommonExtensionOfFilename(oldName))) {
            isSuccessLogo = await new Promise(resolve => {
                fs.rename(this.path_upload_files + '/' + pathUser + '/' + oldName,
                    this.path_upload_files + '/' + pathUser + '/' + newName, (error) => {
                        if (error) {
                            console.error(`Failed to rename logo name: ${error}`);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
            });
            isSuccessThumbnail = await new Promise(resolve => {
                fs.rename(this.path_upload_files + '/' + pathUser + '/' + this.getFilenameWithoutExtension(oldName)
                    + "_thumb." + this.getCommonExtensionOfFilename(oldName),
                    this.path_upload_files + '/' + pathUser + '/' + this.getFilenameWithoutExtension(newName)
                    + "_thumb." + this.getCommonExtensionOfFilename(newName), (error) => {
                        if (error) {
                            console.error(`Failed to rename thumbnail name: ${error}`);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
            });
            isSuccess = isSuccessLogo && isSuccessThumbnail;
        }
        return isSuccess;
    }

};
