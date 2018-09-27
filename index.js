/*
 * @Author: horan 
 * @Date: 2017-07-09 10:24:53 
 * @Last Modified by: horan
 * @Last Modified time: 2018-09-26 18:28:31
 * @Api
 */

var _ = require('underscore');
var fs = require('fs');
var path = require("path");
var moment = require('moment');
var appRoot = require('app-root-path');
var logger = require('./lib/util/logger.js');
var main = require('./lib/main');
var filePath = path.join(appRoot.path, "crawlerData");

var start = function () {
    var getFileList = require('./lib/util/util').readFileList(filePath, [], ".json");
    require('./lib/util/util').createInfoArray(getFileList);
    main.init(getFileList, filePath);
};

var addWatcher = function (fileName, obj) {
    var flag = false;
    try {
        fs.writeFileSync(path.join(filePath, fileName + '.json'), JSON.stringify(obj));
        if (fs.existsSync(path.join(filePath, fileName + '.timestamp'))) {
            fs.unlinkSync(path.join(filePath, fileName + '.timestamp'));
        }
        var existInfo = false;
        if (global.infoArray && global.infoArray.length > 0) {
            _.find(global.infoArray, function (file) {
                if (file.cluster === obj.elasticsearch.e_connection.e_server &&
                    file.index === obj.elasticsearch.e_index) {
                    existInfo = true;
                    return;
                }
            });
        } else {
            global.infoArray = [];
        }
        if (!existInfo) {
            var item = {};
            item.cluster = obj.elasticsearch.e_connection.e_server;
            item.index = obj.elasticsearch.e_index;
            item.msg = "";
            item.status = "w";
            global.infoArray.push(item);
        }
        flag = true;
        return flag;
    } catch (error) {
        logger.errMethod(obj.elasticsearch.e_connection.e_server, obj.elasticsearch.e_index, "addWatcher error: " + error);
    }
};

var updateWatcher = function (fileName, obj) {
    var flag = false;
    try {
        fs.writeFileSync(path.join(filePath, fileName + '.json'), JSON.stringify(obj));
        if (fs.existsSync(path.join(filePath, fileName + '.timestamp'))) {
            fs.unlinkSync(path.join(filePath, fileName + '.timestamp'));
        }
        var existInfo = false;
        if (global.infoArray && global.infoArray.length > 0) {
            _.find(global.infoArray, function (file) {
                if (file.cluster === obj.elasticsearch.e_connection.e_server &&
                    file.index === obj.elasticsearch.e_index) {
                    existInfo = true;
                    return;
                }
            });
        } else {
            global.infoArray = [];
        }
        if (!existInfo) {
            var item = {};
            item.cluster = obj.elasticsearch.e_connection.e_server;
            item.index = obj.elasticsearch.e_index;
            item.msg = "";
            item.status = "w";
            global.infoArray.push(item);
        }
        flag = true;
        return flag;
    } catch (error) {
        logger.errMethod(obj.elasticsearch.e_connection.e_server, obj.elasticsearch.e_index, "updateWatcher error: " + error);
    }
};

var deleteWatcher = function (fileName) {
    var flag = false;
    var newArray = [];
    var currentFileContent = require(path.join(filePath, fileName + '.json'));
    try {
        if (isExistWatcher(fileName)) {
            if (global.infoArray && global.infoArray.length > 0) {
                _.find(global.infoArray, function (file) {
                    if (file.cluster === currentFileContent.elasticsearch.e_connection.e_server &&
                        file.index === currentFileContent.elasticsearch.e_index) {
                        return;
                    } else {
                        newArray.push(file);
                    }
                });
            }
            global.infoArray = newArray;
            fs.unlinkSync(path.join(filePath, fileName + '.json'));
            if (fs.existsSync(path.join(filePath, fileName + '.timestamp'))) {
                fs.unlinkSync(path.join(filePath, fileName + '.timestamp'));
            }
            flag = true;
            return flag;
        }
        return flag;
    } catch (error) {
        logger.errMethod("", "", "deleteWatcher error: " + error);
    }
};

var isExistWatcher = function (fileName) {
    var flag = false;
    try {
        if (fs.existsSync(path.join(filePath, fileName + '.json'))) {
            flag = true;
        }
        return flag;
    } catch (error) {
        logger.errMethod("", "", "isExistWatcher error: " + error);
    }
};

var getInfoArray = function () {
    if (global.infoArray) {
        var newDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var filePath = path.join(appRoot.path, "logs/status.log");
        var jsonData = newDate + " " + JSON.stringify(global.infoArray);
        fs.writeFileSync(filePath, jsonData);
        return global.infoArray;
    } else {
        return null;
    }
};

var startTrace = function () {
    return global.isTrace = true;
}

var stropTrace = function () {
    return global.isTrace = false;
}

module.exports = {
    start: start,
    addWatcher: addWatcher,
    updateWatcher: updateWatcher,
    deleteWatcher: deleteWatcher,
    isExistWatcher: isExistWatcher,
    getInfoArray: getInfoArray,
    startTrace: startTrace,
    stropTrace: stropTrace
};