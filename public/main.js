/*jslint nomen: true */
/*globals window, document, define, $, _, console, WebSocket, alert*/

$(document).ready(function () {
    'use strict';

    var connection;

    function ensureConnection () {
        connection = new WebSocket('ws://localhost:4080/');

        // When the connection is open, send some data to the server
        connection.onopen = function () {
            
            // Ping the server to start connection
            connection.send(JSON.stringify({
                request: 'Ping'
            }));

        };

        // Log errors
        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        // Log messages from the server
        connection.onmessage = function (e) {
            var message = JSON.parse(e.data);

            if (message.response === 'Pong') {
                console.log('connected');
            }

            console.log('Server: ' + e.data);
        };

    }

    $('[data-action="UserMismatch"]').on('click', function (e) {
        connection.send(JSON.stringify({
            request: 'UserMismatch'
        }));
        e.preventDefault();
    });

    ensureConnection();

});







