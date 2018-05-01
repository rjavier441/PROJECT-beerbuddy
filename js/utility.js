//	PROJECT: 		BeerBuddy
// 	Name: 			R. Javier
// 	File: 			utility.js
// 	Date Created: 	April 27, 2018
// 	Last Modified: 	April 27, 2018
// 	Details:
// 					This file contains useful JavaScript functions for the front-end
// 	Dependencies:
// 					JS ECMAscript 6

const DEBUG_VERBOSE = true;

/*
	@function	logDebug
	@parameter	name - name of the function logging the message
	@parameter	ctxt - description of the action being logged
	@parameter	msg - the message to log
	@details 	This function is used to neatly log debug
				messages when Verbose Debugging is enabled
*/
function logDebug (name, ctxt, msg) {
	if (DEBUG_VERBOSE) {
		console.log("[" + name + "] " + ctxt + ": " + msg);
	}
}

/*
	@function	post
	@parameter	uri - the URI endpoint to send the request to
	@parameter	data - the JSON object or array containing the various data (i.e. key-value pairs) to send (null if no data is sent)
	@parameter	callback - an optional function to run on
				a successful AJAX request; is passed three
				arguements based on the request success:
				On AJAX success:
					callback(responseData, responseStatus, jqxhrObject)
				On AJAX error:
					callback(errMsg, "failure", null)
	@parameter 	ajaxMode - (optional) a boolean that, if true, uses JQuery.ajax() instead of JQuery.post()
	@details 	This function sends a post request using JQuery's ajax() API
	@note 		This function automatically converts the data parameter to query-string-like format, if data is not null. It does so using JQuery's param() API. Thus, if data is an array, it must be passed in the format that JQuery's serializeArray() API returns. See JQuery.param()'s API documentation for more information.
*/
function post (uri, data, callback, ajaxMode) {
	switch (ajaxMode === true) {
		case true: {
			logDebug("post()", "Sending in AJAX mode", (typeof data === "object") ? JSON.stringify(data) : data);
			$.ajax(uri, {
				"async": true,
				"method": "POST",
				"data": jQuery.param(data),
				"contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
				"success": function (data, status, jqxhr) {
					if (callback) {
						callback(data, status, jqxhr);
					}
					logDebug("post()", "ajax request result", "success");
				},
				"error": function (jqxhr, status, err) {
					if (callback) {
						callback(err, status, jqxhr);
					}
					logDebug("post()", "ajax request result", `failure -> ${err}`);
				}
			});
			break;
		}
		default: {
			var postData = (data == null) ? null : "?" + (jQuery.param(data));
			logDebug("post()", "Sending in POST mode", (typeof postData === "object") ? JSON.stringify(postData) : postData);
			$.post(uri, postData, function (data, status, jqxhr) {	// success function
				if (callback) {
					callback(data, status, jqxhr);
					logDebug("post()", "AJAX request result", "success");
				}
			}).fail(function () {
				if (callback) {
					callback("Failed to reach " + uri, "failure", null);
					logDebug("post()", "POST Error", "failed to send to " + uri);
				}
			});
			break;
		}
	}
}

/*
	@function 	supportsStorage
    @parameter  type - a string name of the storage bin to check for
    @returns    true, if the storage type is suppored
                false, otherwise
    @details    This function checks for support of new browser storage technology (i.e. an alternative to cookies). Valid inputs include "sessionStorage" or "localStorage"
*/
function supportsStorage (type) {
    try {
        var storage = window[type], x = "__storage_test__";
        storage.setItem(x,x);
        storage.removeItem(x);
        return true;
    } catch (err) {
        console.log("An error occurred when checking '" + type + "'' compatibility");
        return false;
    }
}
// END utility.js
