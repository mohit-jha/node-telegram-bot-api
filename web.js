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
            data.forEach(element => {
                names.push(element.name)
                phones.push(element.phone)
            });

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

                for (i = 1; i <= b.length; i++) {
                    for (j = 1; j <= a.length; j++) {
                        if (b.charAt(i - 1) == a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        }

                        else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                                Math.min(matrix[i][j - 1] + 1,
                                    matrix[i - 1][j] + 1));
                        }
                    }
                }
                console.log(names);
                return matrix[b.length][a.length];
            };

            const output = []
            names.forEach(element => {
                output.push(getEditDistance(resp, element));

            });
            const min = Math.min.apply(null, output)
            console.log(min, "min");
            const indexOfName = (output.indexOf(min));
            console.log(indexOfName);
            if (min == 0) {
                bot.sendMessage(chatId, phones[indexOfName]);

            }
            else {

                bot.sendMessage(chatId, ` did you mean ${names[indexOfName]}`);
            }

        }).catch((err) => { console.log(err) });

});

