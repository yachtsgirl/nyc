$( document ).ready(function() {

  /*window크기 scrollTop높이 초기값 변수선언 및 받아오기*/
  var winHeight;
  var scroll;
  var currentIndex=0;
  var divNumber = $('.no').length;
  resetVariable();

  /*초기 각 페이지의 높이와 너비 받아오기*/
  scaleVideoContainer();
  scaleVideoContainer('.video-container .poster img');
  scaleVideoContainer('.video-container video');

  /*window 리사이즈시마다 각 페이지의 높이와 너비 받아오기*/
  $(window).on('resize', function() {
      resetVariable();
      scaleVideoContainer();
      scaleVideoContainer('.video-container .poster img');
      scaleVideoContainer('.video-container video');
      prevToTop();
  });
  /*window 리사이즈시마다 slide up된 페이지들 위치 맞춰주기*/
  function prevToTop(){
    for(var i=0; i<currentIndex; i++){
      $('div.no').eq(i).css({top:'-'+winHeight+'px'});
    }
  }

  /*div.no에 z-index값 주어줌*/
  for(var i=0; i<divNumber;i++){
    $('.no'+i).css({zIndex:divNumber*10-i});
  }


  /*마우스 움직였을때 wheelAnimate함수호출*/
  $(window).on('mousewheel',wheelAnimate);

  /*터치로 swipe up and down 함수호출*/
  $('.no').on('swipeup',function(){
    currentIndex++;
    movingDown();
  });
  $('.no, .no5').on('swipedown',function(){
    --currentIndex;
    movingUp();
  });

  /*변화된 변수값 새로 저장*/
  function resetVariable(){
    winHeight=$(window).height();
    scroll=$(window).scrollTop();
  }



  /*wheelAnimate 함수*/
  function wheelAnimate(event){
    resetVariable();
    console.log('함수호출시:'+currentIndex);
    //넣으면 느려짐. 연속적 반응 안생김
    if($('div.no').is(':animated')==true){return;}
    if(event.deltaY>0){//mouse up
      --currentIndex;
      console.log('위로:'+currentIndex);
      movingUp();
   }else if(event.deltaY<0){//mouse down
     currentIndex++;
     console.log('아래로'+currentIndex);
     movingDown(event);
   }
  };

  function movingDown(event){
    if(currentIndex>=divNumber && $('.no').eq(divNumber-2).css('top')=='-'+winHeight+'px'){
      //blog전 페이지(마지막 -1 page)에서 스크롤을 내리면
      console.log('check');
      $('.content-wrapper .blog_page').show();
      //마지막 blog_page 의 li크기 받아오기
      $('.blog_page ul li').css({height:$('.blog_page ul li').css('width')});
    }
    if(currentIndex>divNumber){
      //마지막 페이지에서 스크롤을 내리면
      currentIndex=divNumber;
      console.log('맨아래페이지에서'+currentIndex);
    }else{
      //중간페이지에서 스크롤을 내리면
      console.log('앞에페이지에서 아래로'+currentIndex);
      scrollToTop();
      /*스크롤 먹지 않도록 (wheel event는 먹히지만 화면은 움직이지 않음)*/
      if (event.target.id == 'el') return;
      event.preventDefault();
      event.stopPropagation();
    }
    //마지막페이지에서 header에 on class 추가
    if(currentIndex==5){
      $('.header').addClass('on');
    }
  }

  function movingUp(){
    if(currentIndex==$('.no').length-1){
       //마지막페이지(blog)일때
      if($(window).scrollTop()>$('html,body').scrollTop()){
       //내용으로 스크롤이 내려가 있는 상태에서 마우스를 올리면
       currentIndex+=1;
       console.log('마지막페이지에서:'+currentIndex);
     }else if($('html,body').scrollTop()==0){
       //맨마지막페이지에서 맨 위로 올라와서 마우스를 올렸을 때
        scrollToBottom();
        console.log('마지막페이지에서 위로:'+currentIndex);
        $('.content-wrapper .blog_page').fadeOut();
        $('.header').removeClass('on');
     }
   }else if(currentIndex<0){
     //메인페이지에서 스크롤을 올렸을때
     currentIndex=0;
     console.log('맨위페이지에서:'+currentIndex);
   }else{
     //나머지, 중간페이지에서 스크롤 올렸을때
      scrollToBottom();
      console.log('올라가면서:'+currentIndex);

   }
  }


  /*div.no top으로 이동하는 함수*/
  function scrollToTop(){
    if(currentIndex<=divNumber){
      $('div.no').eq(currentIndex-1).animate({top:'-'+winHeight+'px'},800);

    }
  }
  /*div.no bottom으로 이동하는 함수*/
  function scrollToBottom(){
    if(currentIndex<=divNumber){
      $('div.no').eq(currentIndex).animate({top:0},800);
    }
  }

  /*메인 하단 blog_page에 hover시 효과*/
  $('.content-wrapper .blog_page ul li').on({
    'mouseenter': function fetchData(){
      var nowDiv = $(this).index();
      $(this).children('a').css({transform: 'scale(0.83)'});
      $(this).append('<div></div>');
      $(this).children('div').append('<h2></h2>');
      //나중에 DB에서 blog 글에서 제목 받아오기
      $(this).children('div').children('h2').text($('.blog_page ul li').eq(nowDiv).children('a').attr('alt'));
      $(this).children('div').addClass('blog').fadeIn();
    },
    'mouseleave': function removeData(){
      $(this).children('a').css({transform: 'scale(1)'});
      $(this).children().remove('.blog');
    }
  })




});//document.ready end



/*scaleVideoContainer 함수*/
function scaleVideoContainer() {
  var height = $(window).height();
  var unitHeight = parseInt(height) + 'px';
  var width = $(window).width();
  if(width>height*1.806872){
    $('.no').css('height',unitHeight);
    $('.video-container video').css({'width':width, 'height':'auto'});
  }else{
    $('.no').css('height',unitHeight);
    $('.video-container video').css({'height':height,'width':'auto'});
  }
}
