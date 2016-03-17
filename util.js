function checkForm(form){

  var searching = "error";
  var errorMsg = "";

  if (form == undefined) {

    errorMsg = "you must complete the form !";
  
  } else if (form.site == undefined) {

    errorMsg = "you must add a web site !";          
  
  } else if (form.date == undefined || form.date.length < 0) {

    errorMsg = "you must add a date !";
  
  } else if (form.range == undefined || form.range.length < 0) {

    errorMsg = "you must add a range !";
  
  } else {

    searching = "searching";

    var dates = _.map(form.date,function(v){
      return v;
    });

    for (var i = 0; i < dates.length; i++) {
      if (dates[i].match(/(\d\d\d\d-\d\d-\d\d)/g) == undefined) {
        return {"searching": "error", "errorMsg": "One of the dates do not have a good format dd-mm-yyyy"};
      }
    }

    var ranges = _.map(form.range,function(v){
      return v;
    });

    for (var i = 0; i < ranges.length; i++) {
      if (parseInt(ranges[i]) < 0) {
        return {"searching": "error", "errorMsg": "One of the tolerances is not an integer or is < to 0"};
      }
    }

    if (form.period != undefined) {
      if (parseInt(form.period) < 0) {
        return {"searching": "error", "errorMsg": "Period is not an integer or is < to 0"};
      }
    }

    if (form.occurence != undefined) {
      if (parseInt(form.occurence) < 0) {
        return {"searching": "error", "errorMsg": "Occurences is not an integer or is < to 0"};
      }
    }    
  }

  return {"searching": searching, "errorMsg": errorMsg};
}

function createDates(date,occ,days) {

    var ref = date;

    dates = [];

    for (var i = 0; i < occ; i++) {

      var d = new Date(ref);
      d.setDate(d.getDate() + i*days);
      dates.push(d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2));             
    }  

    return dates;
}

function createRanges (range, occ) {
  var r = [];
  for (var i = 0; i < occ; i++) {
    r.push(range);
  }
  return r;
}

function drawTrees(grids,doc) {

  for (var i = 0; i < grids.length; i ++) {

    for (var j = 0; j < grids[i].length; j ++) {

      console.log("cell-" + i + j);

      var diameter = doc.getElementById("cell-" + i + j).clientHeight;

      console.log(diameter);

    }

  }

}

function getBranch(url,diff) {

  if (url.length == 1) {
    return {name:url[0],diff:diff,children:[]};
  } else {
    return{name:url[0],diff:diff,children:[getBranch(_.rest(url),diff)]};
  }
}

function mergeBranch(m, branch) {
  if(_.isEmpty(branch.children)) {
    if(m.name == branch.name){
      m.diff = branch.diff;
    } else {
      m.children.push(branch);
    }
  } else {
      var isChild = false;
      var idx = 0;
      for(var i = 0; i < m.children.length; i ++){
        if(m.children[i].name == branch.children[0].name){
          isChild = true;
        }
      }
      if(isChild){
        m.children[idx] = mergeBranch(m.children[idx],branch.children[0]); 
      } else {
        m.children.push(branch.children[0]);
      }      
  }

  return m;
}

function sum(x, y) {
    if (y > 0) {
      return {tt:sum(x + 1, y - 1)};
    } else {
      return x;
    }
}