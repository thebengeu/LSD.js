console.log(Yelp);
console.log(localforage);
Yelp.setCredentials(
        "sy_dqaaRlT6u_-Ilez-qyA",
        "wwZjPzhHV1g5lj8TCB7daluc1l8",
        "xk3agjfaF7pttsF-XmbVT9PjodN5fXiO",
        "3Ejttk8-u56maYxZ3aP02ebMuWs"
/*
        "BQm6LwHm_AG3vxtUda-Wjg",
        "Oj4wnt8BnlWZ8yXODwYL-am5M1E",
        "iXnOYMYS-st0TLYwwcHdwIUrSEW74Zm-",
        "DEXBcW4_hACbk__AZJcCA4PMDJs"
        */
        );

//Yelp.sync(1.2001,103.811, 'food');
Yelp.query(1.2001,103.811, 'food', function(data){console.log("asd"); console.log(data);});
