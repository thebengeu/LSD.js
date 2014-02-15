var auth = { 

    // Update with your auth tokens
    //
    consumerKey: "BQm6LwHm_AG3vxtUda-Wjg",
    consumerSecret: "Oj4wnt8BnlWZ8yXODwYL-am5M1E",
    accessToken: "iXnOYMYS-st0TLYwwcHdwIUrSEW74Zm-",
    accessTokenSecret: "DEXBcW4_hACbk__AZJcCA4PMDJs",
    serviceProvider: { 
        signatureMethod: "HMAC-SHA1"
    }
};

var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key',
        auth.consumerKey]);
parameters.push(['oauth_consumer_secret',
        auth.consumerSecret]);
parameters.push(['oauth_token',
        auth.accessToken]);
parameters.push(['oauth_signature_method',
        'HMAC-SHA1']);

var message = { 
    'action':
        'http://api.yelp.com/v2/business/bay-to-breakers-12k-san-francisco',
    'method': 'GET',
    'parameters': parameters 
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message,
        accessor);

var parameterMap =
OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature =
OAuth.percentEncode(parameterMap.oauth_signature)
    console.log(parameterMap);

$.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': 
    function(data,
        textStats,
        XMLHttpRequest) {
        console.log(data);
        var output =data;
    }
});
    console.log(localforage);
    var users = [ {id: 1, fullName: 'Matt'}, {id: 2, fullName: 'Bob'} ];
    localforage.setItem('users', users, function(result) {
        console.log(result);
    });
localforage.getItem('user', function(result){alert(result);});
