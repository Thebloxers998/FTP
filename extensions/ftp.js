// Name: FTP
// ID: ftp
// Description: Uses FTP for files. 
// By: Thebloxers998 <https://scratch.mit.edu/users/Thebloxers998>
// License: MIT

(function(Scratch) {
    "use strict";

    const ArgumentType = Scratch.ArgumentType;
    const vm = Scratch.vm 
    const BlockType = Scratch.BlockType;
    const Cast = Scratch.Cast;
    const formatMessage = Scratch.formatMessage;

    class FTP {
        constructor() {
            this._ftpClient = null;
            this._events = {}
          }

        getInfo() {
            return {
                id: "ftp",
                name: "FTP",
                color1: "#4C97FF", // Primary color
                color2: "#3373CC", // Secondary color
                color3: "#2A56A5", // Tertiary color
                blocks: [
                    {
                        opcode: "connect",
                        blockType: BlockType.COMMAND,
                        text: "connect to [HOST] with user [USER] and password [PASSWORD]",
                        arguments: {
                            HOST: {
                                type: ArgumentType.STRING,
                                defaultValue: "ftp.example.com"
                            },
                            USER: {
                                type: ArgumentType.STRING,
                                defaultValue: "username"
                            },
                            PASSWORD: {
                                type: ArgumentType.STRING,
                                defaultValue: "password"
                            }
                        }
                    },
                    {
                        opcode: "uploadFile",
                        blockType: BlockType.COMMAND,
                        text: "upload file [FILE] to [PATH]",
                        arguments: {
                            FILE: {
                                type: ArgumentType.STRING,
                                defaultValue: "file.txt"
                            },
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/path/to/upload"
                            }
                        }
                    },
                    {
                        opcode: "downloadFile",
                        blockType: BlockType.COMMAND,
                        text: "download file [FILE] from [PATH]",
                        arguments: {
                            FILE: {
                                type: ArgumentType.STRING,
                                defaultValue: "file.txt"
                            },
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/path/to/download"
                            }
                        }
                    },
                    {
                        opcode: "listDirectory",
                        blockType: BlockType.REPORTER,
                        text: "list directory [PATH]",
                        arguments: {
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/"
                            }
                        }
                    },
                    {
                        opcode: "deleteFile",
                        blockType: BlockType.COMMAND,
                        text: "delete file [FILE] from [PATH]",
                        arguments: {
                            FILE: {
                                type: ArgumentType.STRING,
                                defaultValue: "file.txt"
                            },
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/path/to/delete"
                            }
                        }
                    },
                    {
                        opcode: "renameFile",
                        blockType: BlockType.COMMAND,
                        text: "rename file [OLD_NAME] to [NEW_NAME] in [PATH]",
                        arguments: {
                            OLD_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "oldfile.txt"
                            },
                            NEW_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "newfile.txt"
                            },
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/path/to/rename"
                            }
                        }
                    },
                    {
                        opcode: "checkConnection",
                        blockType: BlockType.BOOLEAN,
                        text: "is connected to FTP server?"
                    },
                    {
                        opcode: "disconnect",
                        blockType: BlockType.COMMAND,
                        text: "disconnect from FTP server"
                    },
                    {
                        opcode: "onFileUploaded",
                        blockType: BlockType.HAT,
                        text: "when file [FILE] is uploaded to [PATH]",
                        arguments: {
                            FILE: {
                                type: ArgumentType.STRING,
                                defaultValue: "file.txt"
                            },
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/path/to/upload"
                            }
                        }
                    },
                    {
                        opcode: "onFileDownloaded",
                        blockType: BlockType.HAT,
                        text: "when file [FILE] is downloaded from [PATH]",
                        arguments: {
                            FILE: {
                                type: ArgumentType.STRING,
                                defaultValue: "file.txt"
                            },
                            PATH: {
                                type: ArgumentType.STRING,
                                defaultValue: "/path/to/download"
                            }
                        }
                    }
                ]
            };
        }

        connect(args) {
            const host = Cast.toString(args.HOST);
            const user = Cast.toString(args.USER);
            const password = Cast.toString(args.PASSWORD);

            // Initialize FTP client and connect
            this._ftpClient = new FTPClient();
            this._ftpClient.connect({
                host: host,
                user: user,
                password: password
            });
        }

        uploadFile(args) {
            const file = Cast.toString(args.FILE);
            const path = Cast.toString(args.PATH);

            if (this._ftpClient) {
                this._ftpClient.upload(file, path, (err) => {
                    if (err) {
                        console.error("Upload failed:", err);
                    } else {
                        console.log("Upload successful");
                        this._triggerEvent("onFileUploaded", { FILE: file, PATH: path });
                    }
                });
            } else {
                console.error("Not connected to FTP server");
            }
        }

        downloadFile(args) {
            const file = Cast.toString(args.FILE);
            const path = Cast.toString(args.PATH);

            if (this._ftpClient) {
                this._ftpClient.download(file, path, (err) => {
                    if (err) {
                        console.error("Download failed:", err);
                    } else {
                        console.log("Download successful");
                        this._triggerEvent("onFileDownloaded", { FILE: file, PATH: path });
                    }
                });
            } else {
                console.error("Not connected to FTP server");
            }
        }

        listDirectory(args) {
            const path = Cast.toString(args.PATH);

            if (this._ftpClient) {
                return new Promise((resolve, reject) => {
                    this._ftpClient.list(path, (err, list) => {
                        if (err) {
                            console.error("List directory failed:", err);
                            reject(err);
                        } else {
                            resolve(list.map(item => item.name).join(", "));
                        }
                    });
                });
            } else {
                console.error("Not connected to FTP server");
                return "";
            }
        }

        deleteFile(args) {
            const file = Cast.toString(args.FILE);
            const path = Cast.toString(args.PATH);

            if (this._ftpClient) {
                this._ftpClient.delete(file, path, (err) => {
                    if (err) {
                        console.error("Delete failed:", err);
                    } else {
                        console.log("Delete successful");
                    }
                });
            } else {
                console.error("Not connected to FTP server");
            }
        }

        renameFile(args) {
            const oldName = Cast.toString(args.OLD_NAME);
            const newName = Cast.toString(args.NEW_NAME);
            const path = Cast.toString(args.PATH);

            if (this._ftpClient) {
                this._ftpClient.rename(oldName, newName, path, (err) => {
                    if (err) {
                        console.error("Rename failed:", err);
                    } else {
                        console.log("Rename successful");
                    }
                });
            } else {
                console.error("Not connected to FTP server");
            }
        }

        checkConnection() {
            return this._ftpClient !== null;
        }

        disconnect() {
            if (this._ftpClient) {
                this._ftpClient.end();
                this._ftpClient = null;
                console.log("Disconnected from FTP server");
            } else {
                console.error("Not connected to FTP server");
            }
        }

        _triggerEvent(eventName, args) {
            if (this._events[eventName]) {
                this._events[eventName].forEach(callback => callback(args));
            }
        }

        onFileUploaded(args, util) {
            this._registerEvent("onFileUploaded", util.thread);
        }

        onFileDownloaded(args, util) {
            this._registerEvent("onFileDownloaded", util.thread);
        }

        _registerEvent(eventName, thread) {
            if (!this._events[eventName]) {
                this._events[eventName] = [];
            }
            this._events[eventName].push((args) => {
                util.startThread(thread, args);
            });
        }
    }

    Scratch.extensions.register(new FTP());
})(Scratch);
