var pg = require('pg');

var conString = "postgres://fznayoei:9cpbw1EWjMT4u1KYPUri2RpRRhi2XRBt@tiny.db.elephantsql.com/fznayoei";
var client=new pg.Client(conString);
client.connect();
module.exports=client;
