var life         = {years:[]};
var optimism     = 100;
var now          = moment();
var alreadyDrawn = false;

var radio = {
  years: "Years",
  months: "Months",
  weeks: "Weeks",
  days: "Days"
};

var size,rowWidth,spacing,multiplier,start,duration,delay,extra;

function drawLife(){
  console.log("---------------")
  if ($('#birthday').val() === '') {
    $('.svgContainer').html("<p class='no_birthday starter-template'>Please enter a birthdate.</p>");
    $('.no_birthday').fadeTo(500, 1); 
    window.alreadyDrawn = true;
  } else {

    window.scale = $('input.timeScale:checked').val(); //from the radio buttons
    //should adjust to use window.innerWidth & window.innerHeight for responsive design?
    if (scale  === "years")       {
      comment = "Each row contains 10 years.";
      yearsPerRow = 10;
      rowWidth    = 10;
      size        = 35;
      spacing     = 50;
      multiplier  = 1;
      start       = 235;
      duration    = 2000;
      delay       = 30;
      extra       = 0;
    } else if (scale === "months") {
      comment = "Each row contains 36 months (3 years).";
      yearsPerRow = 3;
      rowWidth    = 36;
      size        = 35*.33;
      spacing     = 50*.33;
      multiplier  = 12;
      start       = 108;
      duration    = 1000;
      delay       = 10;
      extra       = 70;
    } else if (scale === "weeks")  {
      comment = "Each row contains 52 weeks.";
      yearsPerRow = 1;
      rowWidth    = 52;
      size        = 8;
      spacing     = 11;
      multiplier  = 52;
      start       = 150;
      duration    = 1000;
      delay       = 5;
      extra       = 200;
    } else if (scale === "days")   {
      comment = "Each row contains 365 days.";
      yearsPerRow = 1;
      rowWidth    = 365;
      size        = 3;
      spacing     = 5;
      multiplier  = 365;
      start       = 10;
      duration    = 2000;
      delay       = 1;
      extra       = 100;
      if (prompt("if your screen is smaller than 1920*1080, type 'yes' for smaller squares.") === 'yes'){
        size      = 2;
        spacing   = 3;
      }
    }

    window.optimism      = $('#optimism')[0].value;
    window.birthdate     = moment($('#birthday').val(), "MM/DD/YYYY hh:mm A"); //should start using this
    window.currentAge    = moment.duration(moment().diff(birthdate));
    window.timeLeft      = moment.duration((120*multiplier-Number(currentAge.as(scale)))*(optimism/100), scale) 
    window.ageAtDeath    = moment.duration(Number(currentAge.as(scale)) + Number(timeLeft.as(scale)), scale);
    window.percentLived  = Math.floor((100/(ageAtDeath.as('days')/currentAge.as('days')))*100)/100;
           percentLived  = isNaN(percentLived) ? 0 : percentLived; // handles exception for 0 optimism for dates in the future (i.e., 0*0)

    window.life = [];
    if (ageAtDeath.as(scale) < 50000 || 
        prompt("50k range size limit reached. Your attempted unit size: " + 
          Math.floor(ageAtDeath.as(scale)) + 
          ". if you want to try this anyways--it may crash your browser!--type 'yes'") === 'yes') {
      
      for (var i = 0; i < ageAtDeath.as(scale); i++){
        window.life.push(i);
      }
    } 

    if (alreadyDrawn) {
      $('.svgContainer').animate({"opacity": "0"}, 1000, function(){
        $('.svgContainer').html("");
        drawStats();
        drawGrid();
      });
    } else {
      alreadyDrawn = true;
      drawStats();    
      drawGrid();
    }
  }
}

function drawStats() {
  console.log("drawStats")
  // window.curClone = currentAge;

  $('rect').on('click', function(){ $(this).css('fill', 'rgb(128, 200, 128)'); });
  // console.log("prejquery: " + Math.floor(currentAge.asYears()) + ", and curClone: " + curClone.asYears())
  $('.results').html(
    "<strong>Grey squares represent units of life already lived, gold represents units remaining.</strong>" +
    "<br />" + comment +
    "<br/>Current Age: <strong>" + Math.floor(currentAge.asYears()) + "</strong>" +
    "<br/>Time left: <strong>" + moment().add(timeLeft).fromNow(true) + "</strong>"  +
    "<br/>Weeks of life left: <strong>" + Math.floor(timeLeft.asWeeks()) + "</strong>" +
    "<br/>Days of life left: <strong>" + Math.floor(timeLeft.asDays()) + "</strong>" +
    "<br/>Time & Date of Death: <strong>" + moment().add(timeLeft).format('MM/DD/YYYY hh:mm a') + "</strong>" +
    "<br/>Percent of life lived: <strong>" + percentLived + "%</strong>" +
    "<br/>Presumed total length of life: <strong>" + birthdate.from(moment().add(timeLeft),true) + "</strong>" 
  );
  $('.results').fadeTo(1000,1);
  // console.log(5.9 + " pre-reassign, "  + curClone.asYears() + ", and then currentAge: " + currentAge.asYears())
  // var curClone = currentAge;
  // console.log("post jQuery: " + curClone.asYears() + ", currentAge: " + currentAge.asYears())
}

function drawGrid(){
  console.log("drawGrid")
  var loc = {x:0,y:15};

  $('.svgContainer').css({"opacity": "1"})
  var box = d3.select(".svgContainer")
    .append("svg")
    .attr("id","theCanvas")
    .attr("width",1850)
    .attr("height", ((size + spacing)*.65) * (life.length/multiplier/yearsPerRow) ) 
    // .style("border", "1px solid black");

  var rects = box
    .selectAll("rect")
    .data(life)
    .enter()
    .append("rect")
    .attr("x", function(unit,i){
      loc.x = (i%rowWidth === 0 ? start : loc.x + spacing);
      return loc.x;
    })
    .attr("y", function(unit,i){
      if (i % rowWidth === 0 && i !== 0) loc.y += spacing;
      return loc.y;
    })
    .attr("width", size)
    .attr("height", size)
    .style("fill-opacity","0")
    .transition()
    .delay(function(d, i) {
      return i * delay ;
    })
    .duration(duration)
    .style("fill-opacity","1")
    .style("fill",function(d){
      // console.log(d, Math.floor(currentAge.as(scale)), d >= Math.floor(currentAge.as(scale)))
      return (d >= Math.floor(currentAge.as(scale)) ? "orange" : "grey");
    });
}
    
  // trying to overlay text of unit... grrr
  //
  // // console.log(rects)
  // var overlay = box
  //   // .selectAll('g')
  //   .data($('rect'))
  //   .enter()
  //   .append("text")
  //   .text(function (d,i) {
  //     console.log(life[i][0], d);
  //     // console.log(d[0][0][0][__data__][0])
  //     return life[i][0];
  //   })
  //   .attr("x",function (d) {
  //     console.log('d.x: ' + d.x)
  //     return d.x;
  //   })
  //   .attr("y",function (d) {
  //     return d.y;
  //   })
  //   .attr('text-anchor', 'middle')
  //   .style("fill", "black")
  //   .style("stroke-width", 1.5);
  // }
