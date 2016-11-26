Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Meteor.subscribe('todos');
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

      Meteor.call('addTodo', text);
      // clear form
      event.target.text.value = '';
    },
    'click .toggle-checked': function() {
      Meteor.call('setChecked', this._id, !this.checked);
    },
    'click .delete-todo': function() {
      if (confirm('Are you sure?')) {
        Meteor.call('deleteTodo', this._id);
      }
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.publish('todos', function() {
    if (!this.userId) {
      return Todos.find();
    } else {
      return Todos.find({userId: this.userId});
    }
  })
}





// Meteor Methods: Accessible by both Client & Server
Meteor.methods({
  addTodo: function(text) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todos.insert({
      text,
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTodo: function(todoId) {
    let todo = Todos.findOne(todoId);
    if (todo.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todos.remove(todoId);
  },
  setChecked: function(todoId, setChecked) {
    let todo = Todos.findOne(todoId);
    if (todo.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todos.update(todoId, { $set: { checked: setChecked } });
  }
});
