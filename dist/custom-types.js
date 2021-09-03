"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoobotClient = void 0;
var djs = __importStar(require("discord.js"));
var fs = __importStar(require("fs"));
var MoobotClient = /** @class */ (function (_super) {
    __extends(MoobotClient, _super);
    function MoobotClient() {
        var _this = _super.call(this, {
            intents: [djs.Intents.FLAGS.GUILDS],
        }) || this;
        _this.queue = [];
        _this.commands = new djs.Collection();
        return _this;
    }
    MoobotClient.prototype.registerCommand = function (command) {
        this.commands.set(command.name, command);
    };
    MoobotClient.prototype.loadCommands = function () {
        var _this = this;
        // ASCII Table to check loading of commands
        var tableData = [["Category", "Command", "Loaded?"]];
        // For each command category
        var categories = fs.readdirSync("./commands/");
        categories.forEach(function (category) {
            // Get list of all commands and lazily load each one
            var commands = fs.readdirSync("./commands/" + category + "/");
            commands.forEach(function (command) {
                Promise.resolve().then(function () { return __importStar(require("../commands/" + category + "/" + command)); }).then(function (loadedCommand) {
                    // If the command name is set, set in the client
                    if (loadedCommand) {
                        _this.registerCommand(loadedCommand);
                        tableData.push([category, loadedCommand.name, "✅"]);
                    }
                    else {
                        throw new Error("Moobot - Command " + command + " failed to load, exiting...");
                    }
                });
            });
        });
    };
    return MoobotClient;
}(djs.Client));
exports.MoobotClient = MoobotClient;
