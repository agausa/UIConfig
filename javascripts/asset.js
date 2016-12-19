var gCategoryData = [];
var expandibleTree;
var gHost = window.location.hostname;


function getTopCategories(){
  var URL = 'http://' + gHost + '/ondemand/api/getTopCategories';
  $.getJSON(URL, function(result){
    cbGetTopCategories(result.category);
  }).error(function(e){
    alert("request to " + URL + " failed");
  });
}

getTopCategories();

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
  // alert(id);

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
    //alert(id);
    //{"id":"' . $id . '"}';
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
            //$('#movie-strip-preview').append('<p>' + asset.title + '</p>');
            $('#movie-strip-preview-image').attr('src', gImagePath + asset.logo);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          alert(textStatus);
        }
    });
};
