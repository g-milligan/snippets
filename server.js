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

//Which data folders should be considered groups? And in which order? What fields and display items are set for each group?
var groups=[
  {key:'txt',name:'Text',
    item_display:[
      {el:'v'}
    ],
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

var setGroupDefaults=function(group){
  if(!group.hasOwnProperty('item_display')){
    group['item_display']=[{el:'v'}];
  } return group;
};

var groupKeyIndexes={};
var getGroupByKey=function(key){
  var group;
  if(!groupKeyIndexes.hasOwnProperty(key)){
    for(var g=0;g<groups.length;g++){
      if(groups[g].hasOwnProperty('key')){
        var groupKey=groups[g]['key'];
        groupKeyIndexes[groupKey]=g;
      }
    }
  }
  if(groupKeyIndexes.hasOwnProperty(key)){
    var index=groupKeyIndexes[key];
    group=groups[index];
    group=setGroupDefaults(group);
  }
  return group;
};

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
          else if(ret.hasOwnProperty('break')){
            if(ret['break']){ break; }
          }
        }
      }
    }
  } return files;
}

var getDataItemJson=function(keyVals){
  var ret;
  if(keyVals.nodeType && keyVals.nodeType===1){
    ret={};
    var id=keyVals.tagName.toLowerCase();
    id=id.substring(1);
    //for each child node element in this item node
    for(var d=0;d<keyVals.childNodes.length;d++){
      if(keyVals.childNodes[d].nodeType===1){
        var dataName=keyVals.childNodes[d].tagName.toLowerCase();
        ret[dataName]=keyVals.childNodes[d].nodeValue || keyVals.childNodes[d].textContent;
      }
    }
    ret['id']=id;
  }else{
    if(keyVals.hasOwnProperty('id')){
      ret={};
      for(var k in keyVals){
        if(keyVals.hasOwnProperty(k)){
          ret[k]=keyVals[k];
        }
      }
    }
  }
  return ret;
};

var readItemsFromFiles=function(dirPath,startFileNum,startItemNum,maxItemsAdded){
  var ret;
  if(startFileNum==undefined){ startFileNum=1; }
  if(startItemNum==undefined){ startItemNum=-1; }
  if(maxItemsAdded==undefined){ maxItemsAdded=-1; }
  if(startFileNum>0 && startItemNum>0){
    var itemCountTotalAllFiles=1, itemCountAddedAllFiles=0, prevFile='', stoppedBeforeEnd=false;
    //for each file
    var files=forEachXmlDataFile(dirPath,function(file,fileIndex,fileCount){
      //if at the file number at which to start
      var itemCountTotalInFile=0, itemCountAddedInFile=0;
      if(startFileNum<=fileIndex+1){
        //get xml doc
        var xmlStr=fs.readFileSync(dirPath+'/'+file, 'ascii');
        var xmlDoc=new dom().parseFromString(xmlStr);
        //for each item in this file
        for(var i=0;i<xmlDoc.documentElement.childNodes.length;i++){
          if(xmlDoc.documentElement.childNodes[i].nodeType===1){
            if(startItemNum<=itemCountTotalAllFiles){
              //if not reached maxItemsAdded
              if(maxItemsAdded<1 || itemCountAddedAllFiles<maxItemsAdded){
                if(ret==undefined){ ret=[]; }
                if(prevFile!==file){ ret.push(file); prevFile=file; }
                var itemNode=xmlDoc.documentElement.childNodes[i];
                var itemData=getDataItemJson(itemNode);
                ret.push(itemData)
                itemCountAddedAllFiles++; itemCountAddedInFile++;
              }else{
                stoppedBeforeEnd=true;
              }
            }
            itemCountTotalAllFiles++; itemCountTotalInFile++;
          }
        }
      }
      //if stopped at the maxItemsAdded limit, before the end of the items
      if(stoppedBeforeEnd){
        var filesRemain=fileCount-(fileIndex+1);
        var moreInFile=itemCountTotalInFile - (startItemNum - 1 + itemCountAddedInFile);
        //indicate the number of remaining files and items in this file
        ret.push({break:true,
          files_remain:filesRemain,
          stopped_at_file:fileIndex+1,
          stopped_at_item:itemCountTotalInFile-moreInFile,
          more_in_this_file:moreInFile
        });
        return ret;
      }
    });
  } return ret;
};

var getGroupData=function(group,args){
  if(args==undefined){args={};}
  if(!args.hasOwnProperty('items')){ args['items']={}; }
  if(!args['items'].hasOwnProperty('get_items')){ args['items']['get_items']=true; }
  if(!args['items'].hasOwnProperty('start_file_number')){ args['items']['start_file_number']=1; }
  if(!args['items'].hasOwnProperty('start_item_number')){ args['items']['start_item_number']=1; }
  if(!args['items'].hasOwnProperty('item_count')){ args['items']['item_count']=12; }
  var ret={status:'ok'};
  if(group.hasOwnProperty('key')){
    var dirp=rootDataDir+group['key'];
    if(fs.existsSync(dirp)){
      if(fs.lstatSync(dirp).isDirectory()){
        if(!group.hasOwnProperty('name')){ group['name']=group['key']; }
        var newGroup={key:group['key'],name:group['name']};
        newGroup=setGroupDefaults(newGroup);
        if(group.hasOwnProperty('fields')){ newGroup['fields']=group['fields']; }
        //if first group (get some items to initially load)
        if(args['items']['get_items']){
          //load some items for this newGroup (start at file=1, item=1) get 10 items at most
          newGroup['items']=readItemsFromFiles(
            dirp,
            args['items']['start_file_number'],
            args['items']['start_item_number'],
            args['items']['item_count']
          );
        }
        //add this new group to the array
        ret['group']=newGroup;
      }else{
        ret['status']='error, not a directory: '+dirp;
      }
    }else{
      ret['status']='error, directory missing: '+dirp;
    }
  }
  return ret;
};

//request data on app load
app.post('/request-initial-data', function(req, res){
  var fromUrl=req.headers.referer;
  //if the request came from this local site
  if(isSameHost(fromUrl)){
    var resJson={status:'ok'};
    if(req.body.hasOwnProperty('type')){
      if(req.body['type']==='init'){
        resJson['groups']=[];
        //load start data for the groups
        for(var g=0;g<groups.length;g++){
          var group=groups[g]; var args={items:{get_items:false}};
          if(g===0){ args['items']['get_items']=true; }
          var groupData=getGroupData(group,args);
          if(groupData['status']==='ok'){
            resJson['groups'].push(groupData['group']);
          }else{
            resJson['status']=groupData['status']; break;
          }
        } //end load start data for the groups
      }else{ resJson['status']='error, wrong type in sender'; }
    }else{ resJson['status']='error, no type in sender'; }
    res.send(JSON.stringify(resJson));
  }
});

//request lazy loaded data for a group
app.post('/request-lazyload', function(req, res){
  var fromUrl=req.headers.referer;
  //if the request came from this local site
  if(isSameHost(fromUrl)){
    var resJson={status:'ok'};
    if(req.body.hasOwnProperty('type')){
      if(req.body['type']==='lazyload'){
        if(req.body.hasOwnProperty('key')){
          if(req.body.hasOwnProperty('files_remain')){
            if(req.body.hasOwnProperty('stopped_at_file')){
              if(req.body.hasOwnProperty('stopped_at_item')){
                if(req.body.hasOwnProperty('more_in_this_file')){
                  var startAtFile=-1, startAtItem=1;
                  //if there are any more items to read from the last read file
                  if(req.body['more_in_this_file']>0){
                    startAtFile=parseInt(req.body['stopped_at_file']);
                    startAtItem=parseInt(req.body['stopped_at_item'])+1;
                  }else if(req.body['files_remain']>0){ //any unread files remain?
                    startAtFile=parseInt(req.body['stopped_at_file'])+1;
                  }
                  if(startAtFile>0){
                    var group=getGroupByKey(req.body['key']);
                    if(group!=undefined){
                      var groupData=getGroupData(group,{
                        items:{
                          start_file_number:startAtFile,
                          start_item_number:startAtItem
                        }
                      });
                      if(groupData['status']==='ok'){
                        resJson['group']=groupData['group'];
                      }else{
                        resJson['status']=groupData['status'];
                      }
                    }
                  }
                }else{ resJson['status']='error, missing property, "more_in_this_file" to indicate if there are any unread items in last read file'; }
              }else{ resJson['status']='error, missing property, "stopped_at_item" to indicate the last read item from last read file'; }
            }else{ resJson['status']='error, missing property, "stopped_at_file" to indicate the last read file'; }
          }else{ resJson['status']='error, missing property, "files_remain" to indicate how many additional files remain'; }
        }else{ resJson['status']='error, missing property, "key" to denote which data directory'; }
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
    var resJson={status:'ok','groups':[]};
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
                    var group=getGroupByKey(dir);
                    group['items']=[]; var prevFile='';
                    var itemId; if(req.body[d].hasOwnProperty('item_id')){ itemId=req.body[d]['item_id']; }
                    //if writing a new item (not writing to an existing item)
                    if(itemId==undefined){
                      //read the children of the directory
                      var capByteSize=5242880; //cap the xml files at around 5MB before creating a new one
                       var validFiles=[], smallestBytesSize=-1, smallestFile, writeFile;
                      var files=forEachXmlDataFile(dirp,function(file,fileIndex,fileCount){
                        validFiles.push(file);
                        var stats = fs.statSync(dirp+'/'+file);
                        if(smallestBytesSize===-1 || smallestBytesSize>stats["size"]){
                          smallestBytesSize=stats["size"];
                          smallestFile=dirp+'/'+file;
                          writeFile=file;
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
                        writeFile=fileNum+'.xml';
                        writePath=dirp+'/'+writeFile;
                        fs.writeFileSync(writePath, '<?xml version="1.0"?><'+dir+'></'+dir+'>');
                      }
                      if(prevFile!==writeFile){
                        group['items'].push(writeFile); prevFile=writeFile;
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
                      group['items'].push(getDataItemJson(newItem));
                      resJson['groups'].push(group);
                      //write changes
                      var serializer=new XMLSerializer();
                      var updatedXmlStr=serializer.serializeToString(xmlDoc);
                      fs.writeFileSync(writePath, updatedXmlStr);
                      resJson['summary']='added: ' + writePath + ' - i' + iNum;
                    }else{
                      //writing to an existing item in an existing file

                      var itemFileId=itemId.split('/');
                      var file=itemFileId[0]+'.xml'; var id='i'+itemFileId[1];
                      var writePath=dirp+'/'+file;
                      var xmlStr=fs.readFileSync(writePath, 'ascii');
                      var xmlDoc=new dom().parseFromString(xmlStr);
                      var itemNode=xmlDoc.documentElement.getElementsByTagName(id)[0];

                      for(var f=0;f<req.body[d]['fields'].length;f++){
                        if(req.body[d]['fields'][f].hasOwnProperty('el')){
                          if(req.body[d]['fields'][f].hasOwnProperty('save_value')){
                            var el=req.body[d]['fields'][f]['el'];
                            var save_value=req.body[d]['fields'][f]['save_value'];
                            var elChild=itemNode.getElementsByTagName(el)[0];
                            itemNode.removeChild(elChild);
                            var elChild=xmlDoc.createElement(el);
                            itemNode.appendChild(elChild);
                            var cdataVal=xmlDoc.createCDATASection(save_value);
                            elChild.appendChild(cdataVal);
                          }
                        }
                      }
                      group['items'].push(file);
                      group['items'].push(getDataItemJson(itemNode));
                      resJson['groups'].push(group);
                      //write changes
                      var serializer=new XMLSerializer();
                      var updatedXmlStr=serializer.serializeToString(xmlDoc);
                      fs.writeFileSync(writePath, updatedXmlStr);
                      resJson['summary']='updated: ' + writePath + ' - ' + id;
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
