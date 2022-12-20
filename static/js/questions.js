let questionNum = 0;
let result = {}

var flag_time = true;

var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
var cameraStream = null;

var flagWarning = 0
var inExam = false

var array = null;
var values = 0;
var length = null;

var studtId = $('#stud_id').text()




function startStreaming() {
  inExam = true
  var mediaSupport = 'mediaDevices' in navigator;
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices.getUserMedia({ video: true})
      .then(function (mediaStream) {
        cameraStream = mediaStream;
        stream.srcObject = mediaStream;
        stream.play();
        
      })
      .catch(function (err) {
        console.log("Unable to access camera: " + err);
        alert("Please allow camera access to be able to take exam");
        location.reload();
        
      });
  }
  else {
    alert('Your browser does not support media devices.');
    location.reload();
    return;
  }
}





function stopStreaming() {

  if (null != cameraStream) {
    inExam = false;
    var track = cameraStream.getTracks()[0];
    track.stop();
    stream.load();
    cameraStream = null;
  }
}




function captureSnapshot() {

  if (null != cameraStream) {
    var ctx = capture.getContext('2d');
    var img = new Image();
    ctx.drawImage(stream, 0, 0, capture.width, capture.height);
    img.src = capture.toDataURL("image/png");
    img.width = 340;
    var d1 = capture.toDataURL("image/png");
    var res = d1.replace("data:image/png;base64,", "");
    // console.log(res)
    
    console.log(studtId)
    if (inExam) {
      $.post("/video_feed", {
        data: { 'imgData': res, 'optionSelect': JSON.stringify(result), 'studtId': studtId}
      },
        function (data) {
          console.log(data);
          console.log(data.warning);

          if((data.cheating)){
            finish_test();
            return
          }

          if(data.warning > flagWarning){
            flagWarning = data.warning
            myFunction();
          }

        })
    }

  }
  setTimeout(captureSnapshot, 1000);
}



function startTimer(duration, display) {
    var timer = duration,hours, minutes, seconds;
    
    var interval = setInterval(function () {
        minutes = parseInt((timer%3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            clearInterval(interval);
            flag_time = false;
            finish_test();
        }
    }, 1000);
}

function uncheckAll(){
    $('.answers input').prop('checked', false);
}


function sendTime() {
    var intervalTime = setInterval(function() {
        if(flag_time == false){   
            clearInterval(intervalTime);
        }
        var time = $('#time').text();
        var [mm,ss] = time.split(':');
        // hh = parseInt(hh);
        mm = parseInt(mm);
        ss = parseInt(ss);
        var seconds = mm*60 + ss;
        $.ajax({
            type: 'POST',
            dataType: "json",
            data: {flag:'time', time: seconds},
        });
        // if(flag_time == false){
        //     clearInterval(intervalTime);
        // }  
    }, 5000);
}


function GetQuestionByNumber(num){
    if(num <= 20 && num >=1){
        $.ajax({
            url:'/question/'+num,
            type: 'GET',
            data: num,
            success: function(temp){
                $('#curr-questn').text('Question '+temp.num+' of 20')
                $('#quest').text(temp.question);
                $('#label-a').text(temp.A);
                $('#label-b').text(temp.B);
                $('#label-c').text(temp.C);
                $('#label-d').text(temp.D);
            }
        });
    }
    
    if(num == 1){
        $('#prev').attr('disabled', true);
    }

    else{
        $('#prev').attr('disabled', false);
    }

    if(num == 20){
        $('#next').text('Finish');
    }

    else{
        $('#next').text('Next');
    }

    uncheckAll(); 
    
    if(questionNum in result){

        var opt = convertOption(result[questionNum]);
        var radiobtn = document.getElementById(opt);
        radiobtn.checked = true;
        // $(opt).prop('checked', true);
    }

}


function nextQuestion(){

    var tvalue = $('#next').val()

    if(tvalue == 'Finish'){
        finish_test();
        return
    }
    questionNum++;
    GetQuestionByNumber(questionNum);
}


function prevQuestion(){
    questionNum--;
    GetQuestionByNumber(questionNum);
}


function finish_test(){
    stopStreaming();
    flag_time = true
    display=$('#time');
    startTimer(0, display)
    $.post("/end_test", {
        data: {'optionSelect': JSON.stringify(result), 'studtId': studtId}
      },
      
      function(dres){
        var scores = dres.scores
        var answered = dres.answered
      });
      
    $('.open-body').removeClass('closes');
    $('.main-content').addClass('closes');
}




$(document).ready(function(){

    $('#pro-btn').click(function(){
        $('.open-body').addClass('closes');
        $('.main-content').removeClass('closes');
        
        questionNum++;
        GetQuestionByNumber(questionNum)
        startCapturing()
        var time = parseInt($('#time').text()), display = $('#time');
        time = 100
        startTimer(time, display);
        sendTime();
        flag_time = true;

    });


    $('#next').click(function(e){
        e.preventDefault();
        if(questionNum < 20 ){
            nextQuestion();
        }
    });
    
    
    $('#prev').click(function(e){
        e.preventDefault();
        if(questionNum > 0 ){
            prevQuestion();
        }
    });

    $('.question-no').click(function(e){
        e.preventDefault();
        var current_num= e.currentTarget.outerText
        questionNum = parseInt(current_num);
        GetQuestionByNumber(questionNum);
    });


    $('.answers input').click(function(e){
        var selectedOption = convertId(e.currentTarget.id)
        result[questionNum] = selectedOption
    })

});


function convertId(id){
    if(id == 'option-a'){
        return 'a'
    }

    else if(id == 'option-b'){
        return 'b'
    }

    else if(id == 'option-c'){
        return 'c'
    }

    else if(id == 'option-d'){
        return 'd'
    }
}



function convertOption(option){
    if(option == 'a'){
        return 'option-a'
    }

    else if(option == 'b'){
        return 'option-b'
    }

    else if(option == 'c'){
        return 'option-c'
    }

    else if(option == 'd'){
        return 'option-d'
    }   
}


function startCapturing(){
    startStreaming()
    captureSnapshot()
}





