Router.configure({
    layoutTemplate: 'masterLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'pageNotFound',
    yieldTemplates: {
    nav: {to: 'nav'},
    footer: {to: 'footer'},
    }
});


Router.map(function() {
    this.route('home', {
        path: '/',
    });

    this.route('hashtag', {
        data:function (){ 
            var selectedHash=this.params.hash;
            console.log(this.params.hash);
            return {"selectedHash" : selectedHash};
       
    },
        onBeforeAction: AccountsTemplates.ensureSignedIn
    });

    this.route('mapping',  {
        onBeforeAction: AccountsTemplates.ensureSignedIn
    });
});
