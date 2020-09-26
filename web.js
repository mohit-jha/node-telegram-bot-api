
const express = require("express")();
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
express.get('/', function (req, res) {
    res.send('Admin Homepage')
})
express.listen(3000)
const token = '1379960234:AAEtkJWGW-2HP-D6ozeLrSAltZ3xk5HxibM';
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios");

bot.onText(/\/phone (.+)/, (msg, match) => {
    const chatId = msg.from.id;
    const resp = match[1]
    let names = []
    let phones = []
    axios.get(`https://script.google.com/macros/s/AKfycbzY-rUfCCexcS8qc_X8a0tTr59hkD1OkAgUaI1MKG31tjWKzCcE/exec`)
        .then((res) => {
            var data = res.data
            var check = names.includes(resp);
            data.forEach(element => {
                names.push(element.name)
                phones.push(element.phone)
            });
            if (names.includes(resp)) {
                console.log("sucess");
                var similar_index = names.indexOf(resp);
                bot.sendMessage(chatId, phones[similar_index]);
            }

            else {

                getEditDistance = function (a, b) {
                    if (a.length == 0) return b.length;
                    if (b.length == 0) return a.length;

                    var matrix = [];

                    for (let i = 0; i <= b.length; i++) {
                        matrix[i] = [i];
                    }

                    for (let j = 0; j <= a.length; j++) {
                        matrix[0][j] = j;
                    }

                    // console.log(matrix);
                    for (i = 1; i <= b.length; i++) {
                        for (j = 1; j <= a.length; j++) {
                            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                                matrix[i][j] = matrix[i - 1][j - 1];
                                // console.log(matrix[i - 1][j - 1]);
                            }

                            else {
                                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                                    Math.min(matrix[i][j - 1] + 1,
                                        matrix[i - 1][j] + 1));
                            }
                        }
                    }
                    return matrix[b.length][a.length];
                };

                const output = []
                const names = ["mohit", "himanshu", "vishal", "kaushal", "siddhartha", "abhishek", "z"]
                names.forEach(element => {
                    output.push(getEditDistance("mohi", element));
                });
                const min = Math.min.apply(null, output)
                const indexOfName = (output.indexOf(min));
                bot.sendMessage(chatId, ` did you mean ${names[indexOfName]}`);

            }
        }).catch((err) => { console.log(err) });

});

