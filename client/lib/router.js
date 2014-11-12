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
        onBeforeAction: AccountsTemplates.ensureSignedIn
    });

    this.route('mapping', {
        onBeforeAction: AccountsTemplates.ensureSignedIn
    });
});
