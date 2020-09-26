const express = require("express")();
const {getEditDistance} = require("./function")
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
express.get('/', function (req, res) {
    res.send('Admin Homepage')
})
express.listen(3000)
const token = '1379960234:AAEtkJWGW-2HP-D6ozeLrSAltZ3xk5HxibM';
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios");

let phones = []
let names = []
bot.onText(/\/phone (.+)/, (msg, match) => {
    const chatId = msg.from.id;
    const resp = match[1]
    axios.get(`https://script.google.com/macros/s/AKfycbzY-rUfCCexcS8qc_X8a0tTr59hkD1OkAgUaI1MKG31tjWKzCcE/exec`)
    .then((res) => {
            var data = res.data
            data.forEach(element => {
                names.push(element.name)
                phones.push(element.phone)
            });
                
            const output = []
            names.forEach(element => {
                output.push(getEditDistance(resp, element));
            
            });
            const min = Math.min.apply(null, output)
            const indexOfName = (output.indexOf(min));
            if (min == 0) {
                bot.sendMessage(chatId, phones[indexOfName]);
            
            }
            else if (min == 1 || min == 2) {
                bot.sendMessage(chatId, ` did you mean ${names[indexOfName]}`);
            }
            else{
                bot.sendMessage(chatId, "sorry result not found");
            }            
        }).catch((err) => { console.log(err) });
});


