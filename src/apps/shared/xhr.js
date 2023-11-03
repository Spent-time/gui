//
//  CLOUD CODERS CONFIDENTIAL
//  _________________________
//
//
//   [2016] Cloud Coders Intl. BV
//   All Rights Reserved.
//
//  NOTICE:  All information contained herein is, and remains
//  the property of Cloud Coders Intl. BV and its suppliers,
//  if any.  The intellectual and technical concepts contained
//  herein are proprietary to Cloud Coders Intl. BV
//  and its suppliers and may be covered by Dutch and Foreign Patents,
//  patents in process, and are protected by trade secret or copyright law.
//
//  Dissemination of this information or reproduction of this material
//  is strictly forbidden unless prior written permission is obtained
//  from Cloud Coders Intl. BV.
//

/**
 * <p>
 *   The application startup file.
 * </p>
 *
 * @module apps/main
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // dojo
        'dojo/request/xhr'],

    function (xhr) {

        return {

            get: function (args) {

                var headers = {};
                headers["X-Csrf-Token"] = xhr.token;

                var promise = xhr(args.url, {
                    method: 'GET',
                    preventCache: true,
                    headers: headers,
                    handleAs: 'json'
                });

                promise.response.then(function (response) {

                    xhr.token = response.getHeader('X-Csrf-Token');

                    if (args.success
                        && typeof args.success === 'function') {

                        args.success(response.data);
                    }

                }, function (err) {

                    xhr.token = err.response.getHeader('X-Csrf-Token');

                    if (args.error
                        && typeof args.error === 'function') {

                        args.error(err);
                    }

                });

            },
            post: function (args) {

                var headers = {};
                headers['X-Csrf-Token'] = xhr.token;
                headers['Content-Type'] = 'application/json';

                var promise = xhr(args.url, {
                    method: 'POST',
                    data: dojo.toJson(args.data || {}),
                    headers: headers,
                    handleAs: 'json'
                });

                promise.response.then(function (response) {

                    xhr.token = response.getHeader('X-Csrf-Token');

                    if (args.success
                        && typeof args.success === 'function') {

                        args.success(response.data);
                    }

                }, function (err) {

                    xhr.token = err.response.getHeader('X-Csrf-Token');

                    if (args.error
                        && typeof args.error === 'function') {

                        args.error(err);
                    }

                });

            },
            put: function (args) {

                var headers = {};
                headers['X-Csrf-Token'] = xhr.token;
                headers['Content-Type'] = 'application/json';

                var promise = xhr(args.url, {
                    method: 'PUT',
                    data: dojo.toJson(args.data || {}),
                    headers: headers,
                    handleAs: 'json'
                });

                promise.response.then(function (response) {

                    xhr.token = response.getHeader('X-Csrf-Token');

                    if (args.success
                        && typeof args.success === 'function') {

                        args.success(response.data);
                    }

                }, function (err) {

                    xhr.token = err.response.getHeader('X-Csrf-Token');

                    if (args.error
                        && typeof args.error === 'function') {

                        args.error(err);
                    }

                });

            },
            del: function (args) {

                var headers = {};
                headers['X-Csrf-Token'] = xhr.token;
                headers['Content-Type'] = 'application/json';

                var promise = xhr(args.url, {
                    method: 'DELETE',
                    headers: headers,
                    handleAs: 'json'
                });

                promise.response.then(function (response) {

                    xhr.token = response.getHeader('X-Csrf-Token');

                    if (args.success
                        && typeof args.success === 'function') {

                        args.success(response.data);
                    }

                }, function (err) {

                    xhr.token = err.response.getHeader('X-Csrf-Token');

                    if (args.error
                        && typeof args.error === 'function') {

                        args.error(err);
                    }
                });
            }
        }
    });