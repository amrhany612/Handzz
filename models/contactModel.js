const mongoos = require('mongoose')

const contactSchema = new mongoos.Schema({
    name: String,
    subject:String,
    email: String,
    message: String
})

const contactModel = mongoos.model('Contact', contactSchema);
module.exports = contactModel