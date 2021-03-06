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
            }else{
              viewbox=' viewBox="0 0 640 640"';
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
      },
      x:{
        path:'M498.433 449.321l-113.156-129.321 113.156-129.321c19.242-19.242 19.242-50.424 0-69.624-19.242-19.203-50.424-19.203-69.624 0l-108.807 124.357-108.766-124.316c-19.242-19.242-50.424-19.242-69.624 0-19.203 19.242-19.203 50.424 0 69.624l113.114 129.281-113.156 129.321c-19.203 19.242-19.203 50.341 0 69.544 19.242 19.242 50.424 19.242 69.624 0l108.808-124.275 108.766 124.275c19.242 19.242 50.424 19.242 69.624 0s19.242-50.3 0.041-69.544z'
      },
      plus:{
        path:'M515.052 282.482h-157.572v-157.572c0-20.709-16.77-22.51-37.518-22.51-20.709 0-37.517 1.763-37.517 22.51v157.572h-157.536c-20.748 0-22.51 16.808-22.51 37.518s1.762 37.518 22.51 37.518h157.536v157.572c0 20.709 16.808 22.51 37.517 22.51 20.748 0 37.518-1.801 37.518-22.51v-157.572h157.572c20.748 0 22.548-16.808 22.548-37.518s-1.801-37.518-22.548-37.518z'
      },
      save:{
        path:'M464.816 96h-312.816c-30.8 0-56 25.2-56 56v336c0 30.8 25.2 56 56 56h336c30.8 0 56-25.2 56-56v-304.444l-79.184-87.556zM432 264c0 15.4-12.6 28-28 28h-168c-15.4 0-28-12.6-28-28v-140h224v140zM404 152h-56v112h56v-112z'
      },
      edit:{
        viewbox:'0 0 512 512',
        path:'M410 432h-308c-12.15 0-22-9.839-22-22v-308c0-12.16 9.85-22 22-22h220l-44 44h-154v264h264v-154l44-44v220c0 12.161-9.851 22-22 22zM168 344v-66l198-198h22l44 44v22l-198 198h-66zM267 267l121-121-22-22-121 121 22 22zM212 278l-22 22v22h22l22-22-22-22z'
      },
      copy:{
        viewbox:'0 0 512 512',
        path:'M300 168v-88h-154l-66 66v198h132v88h220v-264h-132zM146 111.112v34.888h-34.888l34.888-34.888zM102 322v-154h66v-66h110v66l-66 66v88h-110zM278 199.113v34.887h-34.887l34.887-34.887zM410 410h-176v-154h66v-66h110v220z'
      },
      trash:{
        viewbox:'0 0 512 512',
        path:'M360.284 116.954h-208.569c-19.198 0-34.761 15.563-34.761 34.761v11.587h278.091v-11.587c0-19.198-15.563-34.761-34.762-34.761zM299.568 93.779l5.111 36.573h-97.358l5.111-36.572h87.136zM302.349 70.606h-92.697c-9.559 0-18.463 7.746-19.786 17.214l-6.775 48.493c-1.325 9.468 5.416 17.214 14.975 17.214h115.872c9.559 0 16.298-7.746 14.976-17.214l-6.775-48.493c-1.325-9.468-10.227-17.214-19.786-17.214v0zM366.078 186.477h-220.156c-12.746 0-22.23 10.386-21.076 23.079l18.978 208.759c1.154 12.693 12.526 23.078 25.273 23.078h173.808c12.746 0 24.118-10.385 25.272-23.078l18.978-208.759c1.154-12.694-8.329-23.079-21.076-23.079zM209.651 395.046h-34.762l-11.587-162.22h46.349v162.22zM279.174 395.046h-46.349v-162.22h46.349v162.22zM337.11 395.046h-34.762v-162.22h46.349l-11.587 162.22z'
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
        ret['deleteGroupItem']=function(whichItem){
          
        };
        ret['copyGroupItemValue']=function(whichItem){

        };
        ret['isOpenEditGroupItemMenu']=function(key){
          var isOpen;
          if(key!=undefined){
            var group=this['wrap'].find('.entities_body .groups .group[name="'+key+'"]:first');
            if(group.length>0){
              if(group.hasClass('solo-menu-edit-field')){
                isOpen=true;
              }else{
                isOpen=false;
              }
            }
          } return isOpen;
        };
        ret['openEditGroupItemMenu']=function(key,whichItem){
          if(key!=undefined){
            var group=this['wrap'].find('.entities_body .groups .group[name="'+key+'"]:first');
            if(group.length>0){
              if(!group.hasClass('solo-menu-edit-field')){
                group.addClass('solo-menu-edit-field');
                if(whichItem!=undefined){
                  if(whichItem.attr('data-file') && whichItem.attr('data-id')){
                    var menu=group.find('.menu-edit-field:last');
                    menu.attr('data-file',whichItem.attr('data-file'));
                    menu.attr('data-id',whichItem.attr('data-id'));
                    whichItem.children('div').not('.btn-copy,.btn-edit,.btn-delete').each(function(){
                      var div=jQuery(this);
                      var divKey=div.attr('name');
                      var divVal=div.find('.value:first').val();
                      var menuField=menu.find('.scroll-fields .fields .field[name="'+divKey+'"]');
                      var ctl=menuField.find('.ctl:last');
                      var input=ctl.children(':first');
                      input.val(divVal);
                    });
                  }
                }
              }
            }
          }
        };
        ret['closeEditGroupItemMenu']=function(key){
          if(key!=undefined){
            var group=this['wrap'].find('.entities_body .groups .group[name="'+key+'"]:first');
            if(group.length>0){
              if(group.hasClass('solo-menu-edit-field')){
                group.removeClass('solo-menu-edit-field');
                var menu=group.find('.menu-edit-field:last');
                menu.attr('data-file','').attr('data-id','');
                var ctls=menu.find('.scroll-fields .fields .field .ctl');
                ctls.each(function(){
                  jQuery(this).children('input,textarea').val('');
                });
              }
            }
          }
        };
        //function to add group item
        ret['addGroupItem']=function(item, args){
          if(item!=undefined){
            //if this is not a data xml file name
            if(typeof item!=='string'){
              var bodyGroups=this['wrap'].find('.entities_body .groups:first');
              var bodyGroup=bodyGroups.children('.group[name="'+args['key']+'"]:first');
              if(bodyGroup.length>0){
                var groupItems=bodyGroup.children('.items:first');
                if(groupItems.length<1){
                  bodyGroup.append('<div class="items"></div>');
                  groupItems=bodyGroup.children('.items:first');
                }
                //if this is a lazy load indicator... to be continued
                if(item.hasOwnProperty('break')){
                  //remove previous lazyloader
                  var lazyLoad=groupItems.children('.lazy-load-more');
                  lazyLoad.remove();
                  //get the estimated remaining unprocessed items' info
                  var files_remain=item['files_remain'];
                  var moreInThisFile=item['more_in_this_file'];
                  var stoppedAtFile=item['stopped_at_file'];
                  var stoppedAtItem=item['stopped_at_item'];
                  if(files_remain>0 || moreInThisFile>0){
                    groupItems.append('<div data-stopfile="'+stoppedAtFile+'" data-stopitem="'+stoppedAtItem+'" data-filesremain="'+files_remain+'" data-itemsremain="'+moreInThisFile+'" class="lazy-load-more"><div class="btn"><span class="ico">'+elc['getSvg']('plus')+'</span><span class="lbl">More</span></div></div>');
                    var moreBtn=groupItems.children('.lazy-load-more:first').children('.btn:first');
                    moreBtn.click(function(){
                      if(initArgs.hasOwnProperty('onlazyload')){
                        var par=jQuery(this).parent();
                        var groupEl=par.parents('.group:first');
                        var send={
                          key:groupEl.attr('name'),
                          files_remain:par.attr('data-filesremain'),
                          stopped_at_file:par.attr('data-stopfile'),
                          stopped_at_item:par.attr('data-stopitem'),
                          more_in_this_file:par.attr('data-itemsremain')
                        };
                        initArgs['onlazyload'](send,groupEl,ret);
                      }
                    });
                  }
                }else{
                  var dataFile=item['file'].substring(0,item['file'].lastIndexOf('.xml'));
                  var dataId=item['id'];
                  var existingItem=groupItems.children('.item[data-file="'+dataFile+'"][data-id="'+dataId+'"]:first');
                  if(existingItem.length<1){
                    //print the new group item
                    groupItems.append('<div class="item" data-file="'+dataFile+'" data-id="'+dataId+'"></div>');
                    var groupItem=groupItems.children('.item:last');
                    groupItem.hover(function(){
                      jQuery(this).addClass('over');
                    },function(){
                      jQuery(this).removeClass('over');
                    });
                    groupItem.mouseleave(function(){
                      jQuery(this).removeClass('over');
                    });
                    if(args.hasOwnProperty('item_display')){
                      for(var e=0;e<args['item_display'].length;e++){
                        var itemDisplay=args['item_display'][e];
                        if(item.hasOwnProperty(itemDisplay['el'])){
                          groupItem.append('<div name="'+itemDisplay['el']+'" class="'+itemDisplay['el']+'"></div>'); var valEl=groupItem.children('div:last');
                          valEl.append('<textarea disabled="disabled"></textarea>');
                          valEl=valEl.children('textarea:first');
                          valEl.val(item[itemDisplay['el']]);
                          valEl.addClass('value');
                        }
                      }
                    }
                    //add controls
                    var doEdit=function(btn){
                      var theItem=btn.parents('.item:first');
                      ret['openEditGroupItemMenu'](theItem.parents('.group:first').attr('name'),theItem);
                    };
                    groupItem.append('<div class="btn-copy"><span class="ico">'+elc['getSvg']('copy')+'</span><span class="lbl">Copy</span></div>');
                    groupItem.append('<div class="btn-edit"><span class="ico">'+elc['getSvg']('edit')+'</span><span class="lbl">Edit</span></div>');
                    groupItem.append('<div class="btn-delete"><span class="ico">'+elc['getSvg']('trash')+'</span><span class="lbl">Delete</span></div>');
                    groupItem.children('.btn-copy:last').click(function(){
                      ret['copyGroupItemValue'](jQuery(this).parents('.item:first'));
                    });
                    groupItem.children('.btn-edit:last').click(function(){
                      doEdit(jQuery(this));
                    });
                    groupItem.find('.v:first').click(function(){
                      doEdit(jQuery(this).parent().children('.btn-edit:last'));
                    });
                    groupItem.children('.btn-delete:last').click(function(e){
                      ret['deleteGroupItem'](jQuery(this).parents('.item:first'));
                    });
                    //move lazy load to the end
                    var lazyLoad=groupItems.children('.lazy-load-more');
                    groupItems.append(lazyLoad);
                  }else{
                    //item already exists... update the values
                    if(args.hasOwnProperty('item_display')){
                      for(var e=0;e<args['item_display'].length;e++){
                        var itemDisplay=args['item_display'][e];
                        if(item.hasOwnProperty(itemDisplay['el'])){
                          var update_value=item[itemDisplay['el']];
                          var div=existingItem.children('[name="'+itemDisplay['el']+'"]');
                          div.find('textarea.value').val(update_value);
                        }
                      }
                    }
                    setTimeout(function(){
                      existingItem.addClass('updated');
                      setTimeout(function(){
                        existingItem.removeClass('updated');
                      },900);
                    },300);
                  }
                }
              }
            }
          }
        };
        ret['addGroupItems']=function(args){
          if(args!=undefined){
            if(args.hasOwnProperty('items')){
              var currentFile='';
              for(var a=0;a<args['items'].length;a++){
                if(typeof args['items'][a]==='string'){ currentFile=args['items'][a]; }
                else{
                  args['items'][a]['file']=currentFile;
                  ret['addGroupItem'](args['items'][a], args);
                }
              }
            }
          }
        };
        //function to add a new group fields
        ret['addGroupField']=function(args, key){
          if(args!=undefined){
            if(!args.hasOwnProperty('key')){
              if(key!=undefined){ args['key']=key; }
            }
            if(args.hasOwnProperty('key')){
              var bodyGroups=this['wrap'].find('.entities_body .groups:first');
              var bodyGroup=bodyGroups.children('.group[name="'+args['key']+'"]:first');
              if(bodyGroup.length>0){
                var menuEditField=bodyGroup.children('.menu-edit-field:first');
                var scrollFields=menuEditField.children('.scroll-fields:first');
                if(args.hasOwnProperty('el') && args.hasOwnProperty('lbl')){
                  var fieldsWrap=scrollFields.children('div:last');
                  if(fieldsWrap.length<1 || !fieldsWrap.hasClass('.fields')){
                    scrollFields.append('<div class="fields"></div>');
                    fieldsWrap=scrollFields.children('.fields:last');
                  }
                  fieldsWrap.append('<div class="field" name="'+args['el']+'"></div>');
                  var fieldWrap=fieldsWrap.children('.field:last');
                  var ctlId=bodyGroup.attr('name')+'_field_'+menuEditField.find('.field').length;
                  fieldWrap.append('<label for="'+ctlId+'">'+args['lbl']+'</label>');
                  fieldWrap.append('<div class="ctl"></div>');
                  var ctl=fieldWrap.children('.ctl:last');
                  var ctlEl='input'; if(args.hasOwnProperty('ctl')){ ctlEl=args['ctl']; } var selfClose=false;
                  switch(ctlEl){
                    case 'input': selfClose=true; break;
                  }
                  if(selfClose){ ctl.append('<'+ctlEl+' id="'+ctlId+'" />'); }
                  else{ ctl.append('<'+ctlEl+' id="'+ctlId+'"></'+ctlEl+'>'); }
                  var newCtl=ctl.children(ctlEl+':first');
                  if(args.hasOwnProperty('attr')){
                    for(var a in args['attr']){
                      if(args['attr'].hasOwnProperty(a)){
                        newCtl.attr(a,args['attr'][a]);
                      }
                    }
                  }



                  fieldWrap[0]['field_data']=args;
                }else if(args.hasOwnProperty('lbl')){
                  scrollFields.append('<div class="fields-heading">'+args['lbl']+'</div>');
                  var newHeading=scrollFields.children('.fields-heading:last');
                  newHeading[0]['field_data']=args;
                }
              }
            }
          }
        };
        ret['getEditFieldsData']=function(key,args){
          var fieldsData;
          if(key!=undefined){
            var bodyGroups=this['wrap'].find('.entities_body .groups:first');
            var bodyGroup=bodyGroups.children('.group[name="'+key+'"]:first');
            if(bodyGroup.length>0){
              bodyGroup.find('.fields .field').each(function(){
                if(fieldsData==undefined){ fieldsData=[]; }
                var ctl=jQuery(this).find('.ctl [id]:first');
                var newField={};
                var includeProp=function(prop){
                  var setProp=false;
                  if(args==undefined){
                    setProp=true;
                  }else if(args.hasOwnProperty('include')){
                    if(args['include'].indexOf(prop)!==-1){
                      setProp=true;
                    }
                  }else if(args.hasOwnProperty('exclude')){
                    if(args['exclude'].indexOf(prop)===-1){
                      setProp=true;
                    }
                  } return setProp;
                };
                if(includeProp('save_value')){
                  newField['save_value']=ctl.val();
                }
                for(var f in jQuery(this)[0]['field_data']){
                  if(jQuery(this)[0]['field_data'].hasOwnProperty(f)){
                    if(includeProp(f)){
                      newField[f]=jQuery(this)[0]['field_data'][f];
                    }
                  }
                }
                fieldsData.push(newField);
              });
            }
          } return fieldsData;
        };
        //function to add a new group fields
        ret['addGroupFields']=function(arr, key){
          if(arr!=undefined){
            for(var a=0;a<arr.length;a++){ ret['addGroupField'](arr[a], key); }
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
                  headGroup.click(function(){
                    ret['setActiveGroup'](jQuery(this).attr('name'));
                  });
                  //body content
                  entities_body.find('.groups:first').append('<div class="group" name="'+args['key']+'"><div class="items"></div><div class="menu-edit-field"><div class="scroll-fields"></div><div class="btns"><span class="save"><span class="ico">'+elc['getSvg']('save')+'</span><span class="lbl">Save</span></span><span class="cancel"><span class="ico">'+elc['getSvg']('x')+'</span><span class="lbl">Cancel</span></span></div></div></div>');
                  var bodyGroup=entities_body.find('.groups .group[name="'+args['key']+'"]:first');
                  var menuEditField=bodyGroup.children('.menu-edit-field:first');
                  var menuBtns=menuEditField.children('.btns:last');
                  var saveBtn=menuBtns.children('.save:first');
                  var cancelBtn=menuBtns.children('.cancel:last');
                  saveBtn.click(function(){
                    if(initArgs.hasOwnProperty('onsave')){
                      var fieldsData=ret['getEditFieldsData'](args['key'], {include:['el','save_value']});
                      var sendData={key:args['key'],fields:fieldsData};
                      var menu=jQuery(this).parents('.menu-edit-field:first');
                      if(menu.attr('data-file') && menu.attr('data-id')){
                        sendData['item_id']=menu.attr('data-file') + '/' + menu.attr('data-id');
                      }
                      initArgs['onsave']([sendData], jQuery(this).parents('.group[name]:first'), ret);
                    }
                    ret['closeEditGroupItemMenu'](jQuery(this).parents('.group[name]:first').attr('name'));
                  });
                  cancelBtn.click(function(){ ret['closeEditGroupItemMenu'](jQuery(this).parents('.group[name]:first').attr('name')); });
                  if(args.hasOwnProperty('fields')){
                    ret['addGroupFields'](args['fields'], args['key']);
                  }
                  //controls like search
                  var headControls=entities_head.find('.controls:first');
                  headControls.append('<div class="control" name="'+args['key']+'"></div>');
                  var headControl=headControls.children('.control:last');
                  headControl.append('<div class="search"><input type="text" placeholder="Search for '+args['name']+'" /><span class="cancel">'+elc['getSvg']('x')+'</span><span class="go">'+elc['getSvg']('search')+'</span></div>');
                  headControl.append('<div class="actions"><span class="add"><span class="ico">'+elc['getSvg']('plus')+'</span><span class="lbl">Add '+args['name']+'</span></span></div>');
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
                    var isOpen=ret['isOpenEditGroupItemMenu'](c.attr('name'));
                    if(isOpen){
                      ret['closeEditGroupItemMenu'](c.attr('name'));
                    }else{
                      ret['openEditGroupItemMenu'](c.attr('name'));
                    }
                  });
                  //set active group, if none are set as active already
                  if(isFirstGroup){ headGroup.click(); }
                }
                //add items to this group
                if(args.hasOwnProperty('items')){
                  ret['addGroupItems'](args);
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
