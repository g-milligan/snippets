var port = 8080;
var host = 'localhost';

var url='http://' + host + ':' + port;

//require
var eol = require('os').EOL;
var express = require('express'); //npm install --save-dev express
var openBrowser = require('open'); //npm install --save-dev open
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser'); //npm install --save-dev body-parser

//function that makes sure ajax requests came from this same page
var isSameHost=function(testUrl){
  var isSame=false;
  var fromUrlNoQs=testUrl;
  if(fromUrlNoQs.indexOf('?')!==-1){
    fromUrlNoQs=fromUrlNoQs.substring(0, fromUrlNoQs.indexOf('?'));
  }
  var thisUrl=url;
  if(thisUrl.lastIndexOf('/')===thisUrl.length-'/'.length){
    thisUrl=thisUrl.substring(0,thisUrl.length-'/'.length);
  }
  if(fromUrlNoQs.lastIndexOf('/')===fromUrlNoQs.length-'/'.length){
    fromUrlNoQs=fromUrlNoQs.substring(0,fromUrlNoQs.length-'/'.length);
  }
  if(thisUrl.indexOf(fromUrlNoQs)===0){
    isSame=true;
  }
  return isSame;
};

//syntaxer root
app.use(express.static(__dirname));
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

//request data on app load
app.post('/request-initial-data', function(req, res){
  var fromUrl=req.headers.referer;
  //if the request came from this local site
  if(isSameHost(fromUrl)){
    var resJson={status:'ok'};
    if(req.body.hasOwnProperty('type')){
      if(req.body['type']==='init'){
        //Which data folders should be considered groups? And in which order?
        var groups=[
          {key:'txt',name:'Text'},
          {key:'regex',name:'Regex'},
          {key:'categories',name:'Category'},
          {key:'builders',name:'Builder'}
        ];
        resJson['groups']=[], rootDataDir='./data/';
        //load start data for the groups
        for(var g=0;g<groups.length;g++){
          var group=groups[g];
          if(group.hasOwnProperty('key')){
            var dirp=rootDataDir+group['key'];
            if(fs.existsSync(dirp)){
              if(fs.lstatSync(dirp).isDirectory()){
                if(!group.hasOwnProperty('name')){ group['name']=group['key']; }
                var newGroup={key:group['key'],name:group['name']};
                //if first group (get some items to initially load)
                if(resJson['groups'].length<1){
                  //load some items for this newGroup
                  //***
                }
                //add this new group to the array
                resJson['groups'].push(newGroup);
              }else{
                resJson['status']='error, not a directory: '+dirp;
                break;
              }
            }else{
              resJson['status']='error, directory missing: '+dirp;
              break;
            }
          }
        } //end load start data for the groups
      }else{ resJson['status']='error, wrong type in sender'; }
    }else{ resJson['status']='error, no type in sender'; }
    res.send(JSON.stringify(resJson));
  }
});

//***

//start up tab
var server = app.listen(port, function () {
  console.log('Open --> '+url);
  openBrowser(url);
});
