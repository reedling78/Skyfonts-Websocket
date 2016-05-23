/*jslint nomen: true */
/*global require, dirname*/

var server = require('http').createServer(),
    WebSocketServer = require('ws').Server,
    chalk = require('chalk'),
    wss = new WebSocketServer({ server: server }),
    express = require('express'),
    _ = require('underscore'),
    app = express(),
    port = 4080,
    activeFonts = [],
    defaults = {
        VersionNumber: '5.3.1.0',
        connectedUsers: [{
            provider: 'fonts.com',
            userId: 'faf0ebaa-e74c-4a12-ab53-5b279a7503c2',
            username: 'reed.rizzo@fonts.com'
        }],
        isLoggedin: true,
        logins: [{
            provider: 'fonts.com',
            userId: 'faf0ebaa-e74c-4a12-ab53-5b279a7503c2',
            username: 'reed.rizzo@fonts.com'
        }],
        machineId: 'C02MV0PDFD58',
        success: true,
        activeFonts: activeFonts
    },
    data = defaults,
    skyfonts = {};



// Fake SkyFonts
skyfonts = {

    // Response to client connction
    connection : function (ws) {
        'use strict';

        ws.send(JSON.stringify(_.extend({
            response: 'Pong'
        }, data)));

        console.log(chalk.green('Connection'));
        console.log(data);
    },

    // Add a font
    addfont : function (ws, message) {
        'use strict';

        var font = _.where(data.activeFonts, {
            SkyFontsId: message.font.SkyFontsId
        });

        if (font.length === 0) {
            data.activeFonts.push(message.font);
        }

        setTimeout(function () {
            ws.send(JSON.stringify(_.extend({
                response: 'FontAdded',
                message: message.font.DisplayName + ' has been installed through SkyFonts.',
                changedFont: message.font
            }, data)));
        }, 500);

        console.log(chalk.green('Font Added'));
        console.log(chalk.cyan(JSON.stringify(message)));
        console.log(data.activeFonts);
    },

    // Remove a font
    removefont : function (ws, message) {
        'use strict';

        data.activeFonts = _.without(data.activeFonts, _.findWhere(data.activeFonts, {
            SkyFontsId: message.font.SkyFontsId
        }));

        setTimeout(function () {
            ws.send(JSON.stringify(_.extend({
                response: 'FontRemoved',
                message: message.font.DisplayName + ' has been removed from your machine.',
                changedFont: message.font
            }, data)));
        }, 500);

        console.log(chalk.red('Font Removed'));
        console.log(chalk.cyan(JSON.stringify(message)));
        console.log(data.activeFonts);
    },

    removefamily : function (ws, message) {
        'use strict';

        var changedFonts = _.where(data.activeFonts, {
            FamilyId: message.font.FamilyId
        });

        data.activeFonts = _(data.activeFonts).filter(function (font) {
            return font.FamilyId !== message.font.FamilyId;
        });

        setTimeout(function () {
            ws.send(JSON.stringify(_.extend({
                response: 'FamilyRemoved',
                message: message.font.DisplayName + ' has been removed from your machine.',
                changedFont: changedFonts
            }, data)));
        }, 500);

        console.log(chalk.red('Family Removed'));
        console.log(chalk.cyan(JSON.stringify(message)));
        console.log(data.activeFonts);
    },

    usermismatch : function (ws, message) {
        'use strict';

        setTimeout(function () {
            ws.send(JSON.stringify(_.extend({
                response: 'UserMismatch',
                message: 'SkyFonts is currently linked with reed.rizzo@fonts.com, but you\'re logged into Fonts.com with reed.rizzo@monotype.com.'
            }, data)));
        }, 500);

        console.log(chalk.red('User Mismatch'));
        console.log(chalk.cyan(JSON.stringify(message)));
        console.log(data.activeFonts);
    },

    sync : function (ws, message) {
        'use strict';

        var i = 0, t;

        t = setInterval(function(){
            ws.send(JSON.stringify(_.extend({
                response: 'Sync',
                message: 'SkyFonts is Syncing Fonts (' + i + ' of 25 installed)',
            }, data)));
            i++;
            if (i > 24) {
                ws.send(JSON.stringify(_.extend({
                    response: 'Sync',
                    message: 'SkyFonts is Syncing Fonts (' + i + ' of 25 installed) Complete',
                    dismiss: true
                }, data)));

                clearInterval(t);
            }

        }, 100);

        console.log(chalk.red('Sync'));
        console.log(chalk.cyan(JSON.stringify(message)));
        console.log(data.activeFonts);
    }

};

// Start web socket server
wss.on('connection', function connection(ws) {
    'use strict';

    // Message Router
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);

        if (message.request === 'Ping') {
            skyfonts.connection(ws, message);
        } else if (message.request === 'AddFont') {
            skyfonts.addfont(ws, message);
        } else if (message.request === 'RemoveFont') {
            skyfonts.removefont(ws, message);
        } else if (message.request === 'RemoveFamily') {
            skyfonts.removefamily(ws, message);
        } else if (message.request === 'UserMismatch') {
            skyfonts.usermismatch(ws, message);
        } else if (message.request === 'Sync') {
            skyfonts.sync(ws, message);
        }

    });

});

// Start Server
server.on('request', app);
server.listen(port, function () {
    'use strict';
    console.log('Listening on http://localhost:' + port);
});









