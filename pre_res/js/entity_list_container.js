var entityListContainer = (function () {
  return {
    init:function(initArgs){
      var ret={status:'ok'};
      var wrap=jQuery('body:first');
      if(initArgs.hasOwnProperty('wrap')){
        var theWrap=jQuery(initArgs['wrap']);
        if(theWrap.length>0){ wrap=theWrap; }
        else{ ret['status']='error, wrap selector, "' + initArgs['wrap'] + '" yielded no element'; }
      }else{ ret['status']='error, must init with a "wrap" selector property'; }
      if(wrap.length>0){
        ret['wrap']=wrap; wrap.addClass('entity_lists_wrapper');
        //function to set active content group
        ret['setActiveGroup']=function(key){
          var headItems=this['wrap'].find('.entities_head .items:first');
          var headItem=headItems.find('.item[name="'+key+'"]:first');
          if(headItem.length>0 && !headItem.hasClass('active')){
            var bodyItems=this['wrap'].find('.entities_body .items:first');
            var bodyItem=bodyItems.find('.item[name="'+key+'"]:first');
            headItems.find('.item.active').removeClass('active');
            bodyItems.find('.item.active').removeClass('active');
            headItem.addClass('active');
            bodyItem.addClass('active');
          }
        };
        //function to add a new content group
        ret['addGroup']=function(args){
          if(args.hasOwnProperty('key')){
            if(args.hasOwnProperty('name')){
              var isFirstGroup=false;
              //if not already init
              var entities_head=this['wrap'].children('.entities_head:first'), entities_body;
              if(entities_head.length<1){
                isFirstGroup=true;
                //init header and body
                this['wrap'].append('<div class="entities_body"><div class="items"></div></div>');
                this['wrap'].append('<div class="entities_head"><div class="items"></div></div>');
                entities_head=this['wrap'].children('.entities_head:last');
                entities_body=this['wrap'].children('.entities_body:first');

              }else{ entities_body=this['wrap'].children('.entities_body:first'); }
              //if not already has this key
              var headItem=entities_head.find('.items .item[name="'+args['key']+'"]:first');
              if(headItem.length<1){
                entities_head.find('.items:first').append('<div class="item" name="'+args['key']+'">'+args['name']+'</div>');
                headItem=entities_head.find('.items .item[name="'+args['key']+'"]:first');
                entities_body.find('.items:first').append('<div class="item" name="'+args['key']+'"></div>');
                var bodyItem=entities_body.find('.items .item[name="'+args['key']+'"]:first');
                headItem.click(function(){
                  ret['setActiveGroup'](jQuery(this).attr('name'));
                });
                if(isFirstGroup){ headItem.click(); }



                
              }
            }
          }
        };
        //init window events, if not already init
        if(!window.hasOwnProperty('entityListContainerInit')){
          //window load event
          jQuery(window).ready(function(){
            var handleResize=function(){

            };
            //resize event
            var resize_timeout;
            jQuery(window).resize(function(){
              clearTimeout(resize_timeout);
              resize_timeout=setTimeout(function(){
                //after window resize
                handleResize();
              },100);
            });
            //on window load
            handleResize();
          });
          window['entityListContainerInit']=true;
        }

      }
      return ret;
    }
  };
}());
