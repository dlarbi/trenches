var Entities = require('../Entity/entity.js');
var Models = require('../assets/models.js');
var Components = require('../Component/component.js');


var EntityComposer = {
  composeBarracks: function(position, placeable) {
    var barracks = Entities.addEntity();
    if(placeable) {
      barracks.addComponent(Components.createComponent('placeable'));
    }
    barracks.addComponent(Components.createComponent('position', position))
    barracks.addComponent(Components.createComponent('visible',
      {
        THREEModel: Models.barracksModel()
      }
    ));
    barracks.addComponent(Components.createComponent('size', .07));
    barracks.addComponent(Components.createComponent('collides'));
    barracks.addComponent(Components.createComponent('health', {value:100, dead: false}));
    barracks.addComponent(Components.createComponent('enemy',
      {
        range: 50,
        damage:10
      }
    ));
    return barracks;
  },

  composePlayerUnit: function(position) {
    var soldier = Entities.addEntity();
    soldier.addComponent(Components.createComponent('position', position));
    soldier.addComponent(Components.createComponent('visible',
      {
        THREEModelGeometry: new THREE.BoxGeometry(10,10,10),
        THREEMaterial: new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
        THREEModel: null
      }
    ));
    soldier.addComponent(Components.createComponent('selectable',{selected: false}));
    soldier.addComponent(Components.createComponent('player', {damage: 10}));
    soldier.addComponent(Components.createComponent('collides'));
    soldier.addComponent(Components.createComponent('movableEntity',{destination:null, speed:0}));
  },

  composeFloor: function() {
    var floor = Entities.addEntity();
    floor.addComponent(Components.createComponent('position', {x:0, y:0, z:0}));
    floor.addComponent(Components.createComponent('size', 1));
    floor.addComponent(Components.createComponent('visible', Models.flatFloor()));
  }
}

module.exports = EntityComposer;
