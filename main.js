Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  // Template Helpers
  Template.main.helpers({
    todos: function(){
      return Todos.find({}, { sort: { createdAt: -1 } });
    }
  });
  Template.main.events({
    'submit .new-todo': function(event) {
      // Prevent refresh of page.
      event.preventDefault();
      let text = event.target.text.value;

      Todos.insert({
        text,
        createdAt: new Date()
      });
      // clear form
      text = '';
    },
    'click .toggle-checked': function() {
      Todos.update(this._id, { $set: { checked: ! this.checked } });
    },
    'click .delete-todo': function() {
      if (confirm('Are you sure?')) {
        Todos.remove(this._id);
      }
    }
  });
}
