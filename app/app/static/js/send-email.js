// function log(obj) {
//     $('#response').text(JSON.stringify(obj));
// }

// var m = new mandrill.Mandrill('MVwUkVnqFAKo_0RU0GB4yQ');

// // API call parameters
// var params = {
//     "message": {
//         "from_email":"example@gmail.com",
//         "to":[{"email":"jake.anderson486@gmail.com"}],
//         "subject": "Sending a text email from the Mandrill API",
//         "html": "<p>Hey *|COOLFRIEND|*, your sick pics are ready! Follow this link to download them *|LANDSATLINK|*.</p>",
//         "autotext": "true",
//         "track_opens": "true",
//         "track_clicks": "true",
//         "merge_vars": [
//             {
//                 "rcpt": "your_recipient_address",
//                 "vars": [
//                     {
//                         "name": "COOLFRIEND",
//                         "content": "Your friend's name"
//                     },
//                     {
//                         "name": "LANDSATLINK",
//                         "content": "5 awesome years"
//                     }
//                 ]
//             }
//         ]
//     }

// };

// function sendTheMail() {
// // Send the email!

//     m.messages.send(params, function(res) {
//         log(res);
//     }, function(err) {
//         log(err);
//     });
// }
jQuery(function($)  
{
    $("#contact_form").submit(function()
    {
        var email = $("#email").val(); // get email field value
        var name = $("#name").val(); // get name field value
        var msg = $("#msg").val(); // get message field value
        $.ajax(
        {
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            data: {
                'key': 'MVwUkVnqFAKo_0RU0GB4yQ',
                'message': {
                    'from_email': email,
                    'from_name': name,
                    'headers': {
                        'Reply-To': email
                    },
                    'subject': 'testing from landsat',
                    'text': "Hey cool landsat user, your sick pics are ready! Follow this link to download them *|LANDSATLINK|*.",
                    'to': [
                    {
                        'email': email,
                        'name': name,
                        'type': 'to'
                    }]
                }
            }
        })
        .done(function(response) {
            alert('Your message has been sent. Thank you!'); // show success message
            $("#name").val(''); // reset field after successful submission
            $("#email").val(''); // reset field after successful submission
        })
        .fail(function(response) {
            alert('Error sending message.');
        });
        return false; // prevent page refresh
    });
});
