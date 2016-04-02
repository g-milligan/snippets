var jax = (function () {
  return {
    //generic ajax post function
    ajaxPost:function(path,args){
      var callback, send;
      if(args!=undefined){
        if(args.hasOwnProperty('callback')){ callback=args['callback']; }
        if(args.hasOwnProperty('send')){ send=args['send']; }
      }
      // construct an HTTP request
      var xhr = new XMLHttpRequest();
      xhr.open('POST', path, true);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.onloadend=function(res){
        //if the server responded with ok status
        var res=JSON.parse(this.responseText);
        //callback, if any
        if(callback!=undefined){ callback(res); }
      }
      // send the collected data as JSON
      if(send!=undefined){ xhr.send(JSON.stringify(send)); }
      else{ xhr.send(); }
    },
    //get data from the data file system
    getData:function(args, callback){
      if(args!=undefined){
        if(args.hasOwnProperty('type')){
          switch(args['type']){
            case 'init':
              //post request
              this['ajaxPost']('/request-initial-data',
                {
                  send:{type:'init'},
                  callback:function(data){
                    callback(data);
                  }
                }
              );
              break;
              case 'lazyload':
                //post request
                this['ajaxPost']('/request-lazyload',
                  {
                    send:args,
                    callback:function(data){
                      callback(data);
                    }
                  }
                );
                break;
          }
        }
      }
    },
    //save data on one of the data items, new or existing
    setDataItem:function(args, callback){
      if(args!=undefined){
        //post request
        this['ajaxPost']('/set-data-item',
          {
            send:args,
            callback:function(data){
              callback(data);
            }
          }
        );
      }
    }
  };
}());
