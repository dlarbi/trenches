var _entities = [];

var Entities = {
  addEntity: function() {
    var entity = new Entity();
    _entities.push(entity);
    return entity;
  },
  removeEntityById: function(id) {
    _entities.forEach(function(entity, index, entities) {
      if(entity.id == id) {
        _entities.splice(index, 1);
      }
    })
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
  this.removeComponent = function(componentName) {
    var self = this;
    for(var key in self.components) {
      if(key == componentName) {
        delete self.components[key];
      }
    }
  }
}

module.exports = Entities;
