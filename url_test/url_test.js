const url = require('url')

const parsedURL = url.parse('http://www.trilliwon.com/profile?name=won')

console.log(parsedURL.protocol)
console.log(parsedURL.host)
console.log(parsedURL.query)
