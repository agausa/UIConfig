var gCategoryData = [];
var expandibleTree;
var gHost = window.location.hostname;
var gStripOffsetX = 0;
var gStripOffsetStep = 100 + 5;

//___________________________ getTopCategories ________________________________

function getTopCategories(){
  var URL = 'http://' + gHost + '/ondemand/api/getTopCategories';
  $.getJSON(URL, function(result){
    cbGetTopCategories(result.category);
  }).error(function(e){
    alert("request to " + URL + " failed");
  });
}

getTopCategories();

//___________________________ init ____________________________________________

function setHighlights(){
  // NOTE: two different divs!

  $('#movie-strip-preview').mouseenter(function(){
      $('#movie-strip-preview-plus').css('visibility','visible');
  });

  $('#movie-strip-preview-plus').mouseleave(function(){
    $('#movie-strip-preview-plus').css('visibility','hidden');
  });
}

//___________________________ cbGetTopCategories ______________________________

function cbGetTopCategories(categories){

  categories.kids.forEach(function(category){
    var dummy = {text:'', tags:-1};
    var categoryLocal = {text:category.title, tags:category.id, nodes:[]};
    categoryLocal.nodes.push(dummy);

    gCategoryData.push(categoryLocal);
  });

  expandibleTree = $('#vod_menu').treeview({
    color: "#7d97ad",
    levels: 1,
    expandIcon: 'glyphicon glyphicon-chevron-right',
    collapseIcon: 'glyphicon glyphicon-chevron-down',
    data: gCategoryData,
    onNodeExpanded: function (event, node) {
      if(node.nodes[0].tags == -1){ //dummy
        getCategoryDetails(node.tags, node, node.nodes[0]);
      }
    }
  });

  // add notification
  $('#vod_menu').on('nodeSelected', function(event, data) {
    if(data.assetType != null && data.assetType == 'movie'){
      getAssetDetails(data.tags);
    }
  });
};

//___________________________ getCategoryDetails ______________________________

function getCategoryDetails(id, node, dummy){
  var request = {categoryId:id, recur:true, pageNum:1, pageSize:100};
  var reqStr = JSON.stringify(request);

  $.ajax({
      url : 'http://' + gHost + '/ondemand/api/getCategoryDetail',
      type: "POST",
      beforeSend: function (request)
      {
        request.setRequestHeader("Home-Id", gHomeId);
        request.setRequestHeader("Service-Group-Id", gServiceGroupId);
        request.setRequestHeader("Billing-Ref-Id", gBillingRefId);
        request.setRequestHeader("Device-Id", gDeviceId);
        request.setRequestHeader("Device-Name", gDeviceName);
        request.setRequestHeader("Art-Name", gArtName);
        request.setRequestHeader("Encryption-Type", gEncryptionType);
        request.setRequestHeader("Stream-Type", gStreamType);
        request.setRequestHeader("Corp", gCorp);
        request.setRequestHeader("Content-Type", 'application/json');
        request.setRequestHeader("Accept-Encoding", 'deflate');
      },
      data : JSON.stringify(request),
      success: function(data, textStatus, jqXHR)
      {
          var categories = data.category;
          var tree = expandibleTree.treeview(true);

          if(categories.kids != null)
          {
            categories.kids.forEach(function(category){
              var dummyLocal = {text:'', tags:-1};
              var categoryLocal = {text:category.title, tags:category.id, nodes:[]};
              categoryLocal.nodes.push(dummyLocal);

              tree.addNodeAfter(categoryLocal, dummy);
            });
          }
          else if(categories.assets != null){
            categories.assets.forEach(function(asset){
              var assetLocal = {text:asset.title, tags:asset.id, nodes:null, icon:'glyphicon glyphicon-film', showButton:true, assetType:'movie'};
              tree.addNodeAfter(assetLocal, dummy);
              });
          }
          tree.removeNode(dummy);
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        alert(textStatus);
      }
  });
};

//___________________________ getAssetDetails _________________________________

function getAssetDetails(assetId){
    var request = {id:assetId};

    $.ajax({
        url : 'http://' + gHost + '/ondemand/api/getAssetDetail',
        type: "POST",
        beforeSend: function (request)
        {
          request.setRequestHeader("Home-Id", gHomeId);
          request.setRequestHeader("Service-Group-Id", gServiceGroupId);
          request.setRequestHeader("Billing-Ref-Id", gBillingRefId);
          request.setRequestHeader("Device-Id", gDeviceId);
          request.setRequestHeader("Device-Name", gDeviceName);
          request.setRequestHeader("Art-Name", gArtName);
          request.setRequestHeader("Encryption-Type", gEncryptionType);
          request.setRequestHeader("Stream-Type", gStreamType);
          request.setRequestHeader("Corp", gCorp);
          request.setRequestHeader("Content-Type", 'application/json');
          request.setRequestHeader("Accept-Encoding", 'deflate');
        },
        data : JSON.stringify(request),
        success: function(data, textStatus, jqXHR)
        {
            var asset = data.assetDetail;

            $('#movie-strip-preview-image').attr('src', gImagePath + asset.logo);
            $('#movie-strip-preview-plus').attr('onclick', 'addAsset2Strip(' + '"' + asset.logo + '"' + ',' + asset.id + ')');
            $('#ampid-on-preview-back').text(asset.id);
            $('#ampid-on-preview').text(asset.id);

            setHighlights();
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          alert(textStatus);
        }
    });
};

//___________________________ addAsset2Strip __________________________________

function addAsset2Strip(logoPath, id){

  // TODO - add to DB

  // check for dublicate
  if($('#movie-strip').children('#' + id).length == 0){
    // add image
    $('#movie-strip').append('<div ' + 'id=' + id + ' class="movie-strip-asset" onclick="removeAssetFromStrip(' + id + ');"' + '><img src=' + gImagePath + logoPath + ' width=100; height=75; ></div>');

    // add time range
    var range = $('#timerange').jqxRangeSelector('getRange');
    var from = getDateString(range.from);
    var to = getDateString(range.to);
    $('#' + id).append('<div ' + 'id=' + id + '-time class="movie-strip-asset-time-from">' + from + '</div>');
    $('#' + id).append('<div ' + 'id=' + id + '-time class="movie-strip-asset-time-to">' + to + '</div>');

    // adjsut offset
    gStripOffsetX += gStripOffsetStep;
    $('#movie-strip').css('width', gStripOffsetX);
  }
};

//___________________________ removeAssetFromStrip ____________________________

function removeAssetFromStrip(id){

  // TODO - remove from DB

  // set time range

  return;// don't delete for now

  $('#' + id).remove();
  gStripOffsetX -= gStripOffsetStep;

  // adjust width for scrolling part
  $('#movie-strip').css('width', gStripOffsetX);
};
