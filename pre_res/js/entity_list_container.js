var entityListContainer = (function () {
  return {
    getSvg:function(key,viewbox){
      var str='';
      if(this['svg'].hasOwnProperty(key)){
        if(this['svg'][key].hasOwnProperty('path')){
          if(viewbox==undefined){
            viewbox='';
            if(this['svg'][key].hasOwnProperty('viewbox')){
              viewbox=' viewBox="'+this['svg'][key]['viewbox']+'"';
            }
          }else{ viewbox=' viewBox="'+viewbox+'"'; }
          str='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'+viewbox+'><path d="'+this['svg'][key]['path']+'"></path></svg>';
        }
      } return str;
    },
    svg:{
      search:{
        viewbox:'0 0 512 512',
        path:'M88.996 423.003c12.966 12.966 33.983 12.966 46.948 0l58.584-58.584c24.085 15.452 52.555 24.657 83.296 24.657 85.543 0 154.901-69.346 154.901-154.901s-69.358-154.9-154.901-154.9c-85.554 0-154.901 69.347-154.901 154.9 0 30.729 9.217 59.211 24.658 83.308l-58.584 58.584c-12.966 12.966-12.966 33.971 0 46.936zM277.826 123.529c61.103 0 110.644 49.529 110.644 110.643s-49.541 110.644-110.644 110.644c-61.113 0-110.644-49.531-110.644-110.644s49.531-110.643 110.644-110.643z'
      }
    },
    init:function(initArgs){
      var elc=entityListContainer;
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
          var headGroups=this['wrap'].find('.entities_head .groups:first');
          var headGroup=headGroups.find('.group[name="'+key+'"]:first');
          if(headGroup.length>0 && !headGroup.hasClass('active')){
            //activate tab
            var bodyGroups=this['wrap'].find('.entities_body .groups:first');
            var bodyGroup=bodyGroups.find('.group[name="'+key+'"]:first');
            headGroups.find('.group.active').removeClass('active');
            bodyGroups.find('.group.active').removeClass('active');
            headGroup.addClass('active');
            bodyGroup.addClass('active');
            //activate controls
            var headControls=this['wrap'].find('.entities_head .controls:first');
            headControls.children('.control.active').removeClass('active');
            var headControl=headControls.children('.control[name="'+key+'"]');
            headControl.addClass('active');
          }
        };
        ret['searchGroup']=function(key, searchText){
          if(key!=undefined){




          }
        };
        ret['cancelSearchGroup']=function(key){
          if(key!=undefined){




          }
        };
        ret['openAddGroupItemMenu']=function(key){
          if(key!=undefined){




          }
        };
        //function to add group item
        ret['addGroupItem']=function(args, key){
          if(args!=undefined){
            if(!args.hasOwnProperty('key')){
              if(key!=undefined){ args['key']=key; }
            }
            if(args.hasOwnProperty('key')){
              var bodyGroups=this['wrap'].find('.entities_body .groups:first');
              var bodyGroup=bodyGroups.children('.group[name="'+args['key']+'"]:first');
              if(bodyGroup.length>0){
                var groupItems=bodyGroup.children('.items:first');
                if(groupItems.length<1){
                  bodyGroup.append('<div class="items"></div>');
                  groupItems=bodyGroup.children('.items:first');
                }
                if(args.hasOwnProperty('txt')){
                  groupItems.append('<div class="item"></div>');
                  var groupItem=groupItems.children('.item:last');
                  groupItem.append('<div class="txt"><pre></pre></div>');
                  var groupItemPre=groupItem.find('.txt pre:first');
                  groupItemPre.html(args['txt']);





                }
              }
            }
          }
        };
        ret['addGroupItems']=function(arr, key){
          if(arr!=undefined){
            for(var a=0;a<arr.length;a++){ ret['addGroupItem'](arr[a], key); }
          }
        };
        //function to add a new content group
        ret['addGroup']=function(args){
          if(args!=undefined){
            if(args.hasOwnProperty('key')){
              if(args.hasOwnProperty('name')){
                var isFirstGroup=false;
                //if not already init
                var entities_head=this['wrap'].children('.entities_head:first'), entities_body;
                if(entities_head.length<1){
                  isFirstGroup=true;
                  //init header and body
                  this['wrap'].append('<div class="entities_body"><div class="groups"></div></div>');
                  this['wrap'].append('<div class="entities_head"><div class="groups"></div><div class="controls"></div></div>');
                  entities_head=this['wrap'].children('.entities_head:last');
                  entities_body=this['wrap'].children('.entities_body:first');
                }else{ entities_body=this['wrap'].children('.entities_body:first'); }
                //if not already has this key
                var headGroup=entities_head.find('.groups .group[name="'+args['key']+'"]:first');
                if(headGroup.length<1){
                  //tabs
                  entities_head.find('.groups:first').append('<div class="group" name="'+args['key']+'">'+args['name']+'</div>');
                  headGroup=entities_head.find('.groups .group[name="'+args['key']+'"]:first');
                  entities_body.find('.groups:first').append('<div class="group" name="'+args['key']+'"></div>');
                  var bodyGroup=entities_body.find('.groups .group[name="'+args['key']+'"]:first');
                  headGroup.click(function(){
                    ret['setActiveGroup'](jQuery(this).attr('name'));
                  });
                  //controls like search
                  var headControls=entities_head.find('.controls:first');
                  headControls.append('<div class="control" name="'+args['key']+'"></div>');
                  var headControl=headControls.children('.control:last');
                  headControl.append('<div class="search"><input type="text" placeholder="Search for '+args['name']+'" /><span class="cancel"></span><span class="go">'+elc['getSvg']('search')+'</span></div>');
                  headControl.append('<div class="actions"><span class="add">Add '+args['name']+'</span></div>');
                  //search
                  var searchGoBtn=headControl.find('.search .go:first');
                  var searchInput=headControl.find('.search input:first');
                  var searchCancelBtn=headControl.find('.search .cancel:first');
                  searchGoBtn.click(function(e){
                    e.preventDefault(); var c=jQuery(this).parents('.control:first');
                    ret['searchGroup'](c.attr('name'),jQuery(this).parent().children('input:first').val());
                  });
                  searchCancelBtn.click(function(e){
                    e.preventDefault(); var c=jQuery(this).parents('.control:first');
                    ret['cancelSearchGroup'](c.attr('name'));
                  });
                  searchInput.keydown(function(e){
                    switch(e.keyCode){
                      case 13: //enter key
                        e.preventDefault(); jQuery(this).parent().children('.go:first').click();
                        break;
                      case 27: //escape key
                        e.preventDefault(); jQuery(this).parent().children('.cancel:last').click();
                        break;
                    }
                  });
                  //add
                  var addBtn=headControl.find('.actions .add:first');
                  addBtn.click(function(e){
                    e.preventDefault(); var c=jQuery(this).parents('.control:first');
                    ret['openAddGroupItemMenu'](c.attr('name'));
                  });
                  //set active group, if none are set as active already
                  if(isFirstGroup){ headGroup.click(); }
                }
                //add items to this group
                if(args.hasOwnProperty('items')){
                  ret['addGroupItems'](args['items'], args['key']);
                }
              }
            }
          }
        };
        ret['addGroups']=function(arr){
          if(arr!=undefined){
            for(var a=0;a<arr.length;a++){ ret['addGroup'](arr[a]); }
          }
        };
        //add groups, if they exist in the init args
        if(initArgs.hasOwnProperty('groups')){
          ret['addGroups'](initArgs['groups']);
        }
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
