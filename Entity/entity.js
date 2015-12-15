var _entities = [];

var Entities = {
  addEntity: function() {
    var entity = new Entity();
    _entities.push(entity);
    return entity;
  },
  getEntities: function() {
    return _entities;
  }
}

var Entity = function() {
  this.id = Math.random(0,1000000);
  this.components = {}
  this.addComponent = function(component) {
    var self = this;
    self.components[component.name] = component;
  }
}

module.exports = Entities;
