const firstName = "Elizabeth";
const lastName = "Reyes";
const username = `${firstName} ${lastName}`;
const email = "brooklyn.reyes@aall.net";

const callback = videoID => {
    console.log(`${username}, ${email}, ${videoID}`)
    window.setTimeout(myInterviewRecorder.reset, 1000)
}

// const updateText = () => {
//     console.log("updating Text")
//     const welcomeString = "Welcome, " + firstName + "!";
//     console.log(welcomeString)
//     let elem = $(".welcome");
//     console.log("elem = ", elem.html())
//     elem.text(welcomeString)
//     //.replace("", welcomeString);
//     console.log("elem = ", elem.html())
// }

// $(document).ready(updateText);


$(document).ready(function(){
  
    /* 1. Visualizing things on Hover - See next part for action on click */
    $('#stars li').on('mouseover', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
     
      // Now highlight all the stars that's not after the current hovered star
      $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
      });
      
    }).on('mouseout', function(){
      $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
      });
    });
    
    
    /* 2. Action to perform on click */
    $('#stars li').on('click', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently selected
      var stars = $(this).parent().children('li.star');
      
      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }
      
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }
      
      // JUST RESPONSE (Not needed)
      var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
      var msg = "";
      if (ratingValue > 1) {
          msg = "Thanks! You rated this " + ratingValue + " stars.";
      }
      else {
          msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
      }
      responseMessage(msg);
      
    });
    
    
  });