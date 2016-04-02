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
var xpath = require('xpath'); //npm install --save-dev xpath
var xmldom = require('xmldom'); //npm install --save-dev xmldom
var dom = xmldom.DOMParser;
var XMLSerializer = xmldom.XMLSerializer;

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

rootDataDir='./data/';

var forEachXmlDataFile=function(dirPath, eachCallback){
  var files = fs.readdirSync(dirPath).sort();
  for(var f=0;f<files.length;f++){
    //if ends in .xml
    if(files[f].lastIndexOf('.xml')===files[f].length-'.xml'.length){
      //if is file, not directory
      if(!fs.lstatSync(dirPath+'/'+files[f]).isDirectory()){
        var ret=eachCallback(files[f],f,files.length);
        if(ret!=undefined){
          if(!ret){ break; }
        }
      }
    }
  } return files;
}

var readItemsFromFiles=function(dirPath,startFileNum,startItemNum,itemCount){
  var ret;
  if(startFileNum==undefined){ startFileNum=1; }
  if(startItemNum==undefined){ startItemNum=-1; }
  if(itemCount==undefined){ itemCount=-1; }
  if(startFileNum>0 && startItemNum>0){
    var currentItemNum=1, currentCount=0, prevFile='';
    var files=forEachXmlDataFile(dirPath,function(file,fileIndex,fileCount){
      if(startFileNum<=fileIndex+1){
        //get xml doc
        var xmlStr=fs.readFileSync(dirPath+'/'+file, 'ascii');
        var xmlDoc=new dom().parseFromString(xmlStr);
        for(var i=0;i<xmlDoc.documentElement.childNodes.length;i++){
          if(xmlDoc.documentElement.childNodes[i].nodeType===1){
            if(startItemNum<=currentItemNum){
              if(itemCount<1 || currentCount<itemCount){
                if(ret==undefined){ ret=[]; }
                if(prevFile!==file){ ret.push(file); prevFile=file; }
                var itemNode=xmlDoc.documentElement.childNodes[i];
                var itemId=xmlDoc.documentElement.childNodes[i].tagName.toLowerCase();
                var itemData={id:itemId.substring(1)};
                for(var d=0;d<itemNode.childNodes.length;d++){
                  if(itemNode.childNodes[d].nodeType===1){
                    var dataName=itemNode.childNodes[d].tagName.toLowerCase();
                    itemData[dataName]=itemNode.childNodes[d].nodeValue || itemNode.childNodes[d].textContent;
                  }
                }
                ret.push(itemData)
                currentCount++;
              }else{
                return false;
              }
            }
            currentItemNum++;
          }
        }
      }
    });
  } return ret;
};

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
          {key:'txt',name:'Text',
            fields:[
              {lbl:'Add/Edit Text'},
              {el:'v',lbl:'Raw Text',ctl:'textarea'}
            ]
          },
          {key:'txttypes',name:'Text-type',
            fields:[
              {lbl:'Add/Edit Text-type'},
              {el:'v',lbl:'File extension, eg: "js", "css"',ctl:'input',attr:{type:'text'}}
            ]
          },
          {key:'regex',name:'Regex',
            fields:[
              {lbl:'Add/Edit Regex'},
              {el:'v',lbl:'Regex String',ctl:'input',attr:{type:'text'}}
            ]
          },
          {key:'categories',name:'Category',
            fields:[
              {lbl:'Add/Edit Category'},
              {el:'v',lbl:'Category Name, eg: "My Category", "keyword"',ctl:'input',attr:{type:'text'}}
            ]
          },
          {key:'fieldsets',name:'Fieldset',
            fields:[
              {lbl:'Add/Edit Fieldset'}
            ]
          },
          {key:'builders',name:'Builder',
            fields:[
              {lbl:'Add/Edit Builder'}
            ]
          }
        ];
        resJson['groups']=[];
        //load start data for the groups
        for(var g=0;g<groups.length;g++){
          var group=groups[g];
          if(group.hasOwnProperty('key')){
            var dirp=rootDataDir+group['key'];
            if(fs.existsSync(dirp)){
              if(fs.lstatSync(dirp).isDirectory()){
                if(!group.hasOwnProperty('name')){ group['name']=group['key']; }
                var newGroup={key:group['key'],name:group['name']};
                if(group.hasOwnProperty('fields')){ newGroup['fields']=group['fields']; }
                //if first group (get some items to initially load)
                if(resJson['groups'].length<1){
                  //load some items for this newGroup (start at file=1, item=1) get 15 items at most
                  newGroup['items']=readItemsFromFiles(dirp,1,1,15);
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

//save data item to file
app.post('/set-data-item', function(req, res){
  var fromUrl=req.headers.referer;
  //if the request came from this local site
  if(isSameHost(fromUrl)){
    var resJson={status:'ok'};
    if(req.body!=undefined){
      if(req.body.length>0){
        //for each item
        for(var d=0;d<req.body.length;d++){
          if(req.body[d].hasOwnProperty('key')){
            var dir=req.body[d]['key'];
            if(req.body[d].hasOwnProperty('fields')){
              if(req.body[d]['fields'].length>0){
                var dirp=rootDataDir+dir;
                if(fs.existsSync(dirp)){
                  if(fs.lstatSync(dirp).isDirectory()){
                    var itemId; if(req.body[d].hasOwnProperty('item_id')){ itemId=req.body[d]['item_id']; }
                    //if writing a new item (not writing to an existing item)
                    if(itemId==undefined){
                      //read the children of the directory
                      var capByteSize=5242880; //cap the xml files at around 5MB before creating a new one
                       var validFiles=[], smallestBytesSize=-1, smallestFile;
                      var files=forEachXmlDataFile(dirp,function(file,fileIndex,fileCount){
                        validFiles.push(file);
                        var stats = fs.statSync(dirp+'/'+file);
                        if(smallestBytesSize===-1 || smallestBytesSize>stats["size"]){
                          smallestBytesSize=stats["size"];
                          smallestFile=dirp+'/'+file;
                        }
                      });
                      var writePath;
                      //if there are any valid xml files saved yet to write to next
                      if(validFiles.length>0 && smallestBytesSize<capByteSize){
                        writePath=smallestFile;
                      }else{
                        //no small-enough xml files to write to, so create a new xml file
                        var fileNum=1;
                        while(validFiles.indexOf(fileNum+'.xml')!==-1){
                          fileNum++; //fileNum not unique, try again
                        }
                        writePath=dirp+'/'+fileNum+'.xml';
                        fs.writeFileSync(writePath, '<?xml version="1.0"?><'+dir+'></'+dir+'>');
                      }
                      var xmlStr=fs.readFileSync(writePath, 'ascii');
                      //figure out the increment id of the new item
                      var xmlDoc=new dom().parseFromString(xmlStr); var itemNames={};
                      for(var c=0;c<xmlDoc.documentElement.childNodes.length;c++){
                        var child=xmlDoc.documentElement.childNodes[c];
                        if(child.nodeType===1){ itemNames[child.tagName.toLowerCase()]=1; }
                      }
                      var iNum=1; while(itemNames.hasOwnProperty('i'+iNum)){ iNum++; }
                      //create the new item element that can contain one or more sub-nodes corresponding to one or more field values
                      var newItem=xmlDoc.createElement('i'+iNum);
                      xmlDoc.documentElement.appendChild(newItem);
                      for(var f=0;f<req.body[d]['fields'].length;f++){
                        if(req.body[d]['fields'][f].hasOwnProperty('el')){
                          if(req.body[d]['fields'][f].hasOwnProperty('save_value')){
                            var el=req.body[d]['fields'][f]['el'];
                            var save_value=req.body[d]['fields'][f]['save_value'];
                            var elChild=xmlDoc.createElement(el);
                            newItem.appendChild(elChild);
                            var cdataVal=xmlDoc.createCDATASection(save_value);
                            elChild.appendChild(cdataVal);
                          }
                        }
                      }
                      //write changes
                      var serializer=new XMLSerializer();
                      var updatedXmlStr=serializer.serializeToString(xmlDoc);
                      fs.writeFileSync(writePath, updatedXmlStr);
                      resJson['summary']='added: ' + writePath + ' - i' + iNum;
                    }else{
                      //writing to an existing item in an existing file




                    }
                  }
                }
              }
            }
          }
        }
      }else{ resJson['status']='error, save array is empty'; }
    }else{ resJson['status']='error, no save array provided'; }
    res.send(JSON.stringify(resJson));
  }
});

//***

//start up tab
var server = app.listen(port, function () {
  console.log('Open --> '+url);
  openBrowser(url);
});
