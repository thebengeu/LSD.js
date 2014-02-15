Yelp = window.Yelp || {};

Yelp = function () {
    var auth = {};
    var accessor = {};
    var TRUNCATE = 2;
    // Sets app's credentials
    setCredentials = function(ck, cs, at, ats) {
        auth = {
            consumerKey: ck,
            consumerSecret: cs,
            accessToken: at,
            accessTokenSecret: ats,
            serviceProvider: {
                signatureMethod: "HMAC-SHA1"
            }
        };
        accessor = {
            consumerSecret: auth.consumerSecret,
            tokenSecret: auth.accessTokenSecret
        };
    };


    // Private function to Query yelp for stuffz
    sync = function(la, lo, term, callBack) {
        var parameters = [];
        parameters.push(['callback', 'cb']);
        parameters.push(['oauth_consumer_key', auth.consumerKey]);
        parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters.push(['oauth_token', auth.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        console.log(parameters);

        var re = new RegExp(' ', 'g');
        term = term.replace(re, '-');
        var queryTemplate = 'http://api.yelp.com/v2/search?radius_filter=10000&term=' + term + '&ll=';


        var queries = [];

        for(var i = -1; i < 1; i ++) {
            var temp_latitude = la + i/100.0;
            for (var j = -1; j < 1; j++) {
                var temp_longitude = lo + j/100.0;
                queries.push(temp_latitude.toFixed(TRUNCATE) + ',' +
                        temp_longitude.toFixed(TRUNCATE));
            }
        }
        console.log(queries);
        for (i in queries) {
            var message = {
                'action': queryTemplate + queries[i],
                'method': 'GET',
                'parameters': parameters
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message,accessor);
            var parameterMap = OAuth.getParameterMap(message.parameters);
            parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
            console.log(parameterMap);

            (function(x) {
                $.ajax({
                    'url': message.action,
                    'data': parameterMap,
                    'cache': true,
                    'dataType': 'jsonp',
                    'success': 
                    function(data,
                        textStats,
                        XMLHttpRequest) {
                            var key = queries[x].toString();
                            localforage.setItem(key, data, function(result){console.log(result);});
                            callBack(data);
                        }
                });
            })(i);
        }

    };

    // User Query
    query = function(la, lo, term, callBack) {
        localforage.getItem(la.toFixed(TRUNCATE).toString() + ',' + lo.toFixed(TRUNCATE).toString(), 
                function(data){
                    if (!data){
                        sync(la, lo, term, callBack);
                    }
                    else {
                        callBack(data);
                    }
                }
                );
        console.log(la.toFixed(TRUNCATE).toString() + ',' + lo.toFixed(TRUNCATE).toString());
    };

    return {
        "setCredentials": setCredentials,
            "query": query
    }

}();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
