var myBackboneApp = myBackboneApp || {};

(function($){
// Data model for a term node
// --------------------------
    myBackboneApp.Node = Backbone.Model.extend({
        urlRoot: '/node'
    });
// Collection of nodes
// -------------------
    myBackboneApp.NodeCollection = Backbone.Collection.extend({
        model: myBackboneApp.Node,
        //url: '/node.json',
        //url: '/drupal_task_1/?q=notes/social/get_socials.json',
        url: '/drupal_task_1/notes/social/get_socials',
        parse: function (response) {
            return response.list;
        }
    });

    var a = new myBackboneApp.NodeCollection().fetch();
// App View
// --------
    myBackboneApp.appView = Backbone.View.extend({
        el: document.getElementById('mybackboneapp'),
        template: _.template( $('#nodeView').html() ),
        initialize: function(options) {
            this.listenTo(this.collection, 'reset', this.renderAll);
            // Kick-off the rendering process by fetching the nodes from the server.
            // Functions listening to the "reset" event will respond.
            this.collection.fetch({
                reset: true,
                collection: this.collection
            });

        },
        renderAll: function() {
            var ul = $('<ul></ul>');
            this.collection.each(function(node) {
                ul.append( this.template(node.toJSON()) );
            }, this);
            this.$el.html( ul );
        }
    });
})(jQuery);
(function($){
    // this is the actual logic that is run on document.ready
    Drupal.behaviors.mybackboneapp = {
        attach: function (context, settings) {
            if(context != document) return;
            var nodes = new myBackboneApp.NodeCollection();
            Drupal.myBackboneApp = new myBackboneApp.appView({
                collection: nodes
            });
        }
    };
})(jQuery);