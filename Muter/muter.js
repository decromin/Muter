var Quotation=new Array()

Quotation[0] = "The internet is a great way to get on the net.";
Quotation[1] = "Thailand and Taiwan are the same country";
Quotation[2] = "These people haven't seen the last of my face. If I go down, I'm going down standing up.";
Quotation[3] = "I'm so smart now. Everyone's always like 'take your top off'. Sorry, NO! They always want to get that money shot. I'm not stupid.";
Quotation[4] = "The doctors X-rayed my head and found nothing.";
Quotation[5] = "Facts are stupid things.";
Quotation[6] = "It isn't pollution that is hurting the environment, it's the impurities in our air and water that are doing it.";
Quotation[7] = "One of my heroes has always been Barbie. She may not do anything, but she always looks amazing doing it.";
Quotation[8] = "Me fail English?  That's unpossible!";
Quotation[9] = "Hang on, my head is stuck in my arse.";
Quotation[10] = "Whenever I watch TV and see those poor starving kids all over the world, I cannot help but cry. I mean I'd love to be skinny like that, but not with all those flies and death and stuff.";
Quotation[11] = "I make Jessica Simpson look like a rock scientist.";
Quotation[12] = "I think gay marriage is something that should be between a man and a woman.";
Quotation[13] = "People think I have changed, and I have changed. I am now the person I know I am.";
Quotation[14] = "I have just stuck a watermelon in my ear.";
Quotation[15] = "What the crap?";
Quotation[16] = "Men do not wear skimpy clothes, so how do gays perv?";
Quotation[17] = "Why look at women?  I can see them naked on the internet!";
Quotation[18] = "Captain Kirk discovered Australia.";

/* var users = {
'Lachlan': ['user_1041146','mute'],
'Lachlan says': ['user_1041146','says'],
'Lex': ['user_1146189','mute'],
'Lex says': ['user_1146189','says'],
'Ramesh': ['user_1041147','mute'],
'Ramesh says': ['user_1041147','says'],
'Alexander': ['user_1041136','mute'],
'Alexander says': ['user_1041136','says'],
'Donkey': ['user_1243927','mute'],
'Donkey says': ['user_1243927','says'],
'Unmute all':  ['off','mute']
} */

var imgSizes = ['200', '300', '250', '350'];

var muteNoisy = 1;
var userMute = null;
var userSay = null;

function userBad(uname, id, state)
{
 this.uname = uname;
 this.id = id;
 this.state = state;
}

var usersNew = [];


function getUsers() {
     // build the users array from the list of logged in users

     usersNew = [];

     $('li.nubbin_region').each(function() {

             var obj;
             obj = new userBad($(this).text(), $(this).attr("id"), "mute");
             usersNew.push(obj);
             obj = new userBad($(this).text() + " says", $(this).attr("id"), "says");
             usersNew.push(obj);

     });
     usersNew.push(new userBad("Unmute ALL", "off", "says"));

}

function receivedMessage(e) {
     var t = e.target;
     var thisMsg = t.id;
    // fisrtly, if the message is a user entering or leaving, reset the user list in the popup
     var leaveMsg = 'leave';
     var enterMsg = 'enter';
     var kickMsg = 'kick';
     var classNm = t.className.toLowerCase();
     if (t.tagName.toLowerCase() === 'tr' && ((classNm.indexOf(leaveMsg) !== -1 || classNm.indexOf(enterMsg) !== -1 || classNm.indexOf(kickMsg) !== -1)))  {
       getUsers()
       $('#mutenoisyContainer').children().remove();
       var id;
       for (id in usersNew) {
           var writeUser = usersNew[id];
           $('#mutenoisyContainer').append('<a class="noisyuser" data-value="'+id+'">' + writeUser.uname);
       }
     }


    // $('.outputinfo').html('usermute = ' + userMute + ' mutenoisy = ' + muteNoisy);

    if (t.tagName.toLowerCase() === 'tr' && t.className.toLowerCase() === ('text_message message ' + userMute)) {
      var msgBody = $(t).find('div.body');
      if (muteNoisy === 1 ) {
        if (userSay === 'says') {
          if ($(t).find('img').length === 0) {
            var whichQuotation=Math.round(Math.random()*((Quotation.length)-1));
            msgBody.html('<span class="mnMsg">'+ Quotation[whichQuotation] +'</span>');
          } else {
            var whichImg1=Math.round(Math.random()*((imgSizes.length)-1));
            var whichImg2=Math.round(Math.random()*((imgSizes.length)-1));
            var imgs = $(t).find('img');
            imgs.attr("src","http://placekitten.com/" + imgSizes[whichImg1] + "/" + imgSizes[whichImg2]);
          }
        } else {
          var hide = $(t).find('div');
          hide.css("display", "none");
        }
      }
    }
}

function initControls() {
    $('<div>').attr('id', 'mutenoisy_users').attr('class', 'tooltip').appendTo('#chat_controls');
    $('<span>').attr('id', 'mutenoisyContainer').attr('class', 'tooltip-inner').appendTo('#mutenoisy_users');
    $('<img>').attr('src',
    chrome.extension.getURL('images/no_cat.png')).attr('id', 'mutenoisy_button').attr('width', '16').attr('height', '15').appendTo('#mutenoisy_users');

    var id;
    for (id in usersNew) {
         var writeUser = usersNew[id];
        $('#mutenoisyContainer').append('<a class="noisyuser" data-value="'+
            id +'">' + writeUser.uname);
    }

    $(document).click(function (e) {
        if (e.target.id !== 'mutenoisy_button' &&
            $('#mutenoisy_button').find(e.target).length === 0) {
                $('#mutenoisyContainer').hide();
        } else {
          $('#mutenoisyContainer').toggle();
        }
    });

    $('#mutenoisyContainer').children('.noisyuser').click(function() {
        var muteThis = this.getAttribute('data-value');
        var userToAffect = usersNew[muteThis];
        if (userToAffect.state === 'off') {
          muteNoisy = 0;
        } else {
          muteNoisy = 1;
        };
        userMute = userToAffect.id;
        userSay  = userToAffect.state;
    });
}

function initListener() {
    $('#chat').bind('DOMNodeInserted', receivedMessage);
}

getUsers();
initControls();
initListener();

