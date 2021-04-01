'use strict';

exports.setMessage = (message) => {
    try {
        const senseHat = require('sense-hat-led');
        senseHat.clear()
        senseHat.showMessage(message)
    } catch(error) {
        console.log(error)
        console.log(message)
    }
}


