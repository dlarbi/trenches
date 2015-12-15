window.Three = require('three');
var Entities = require('./Entity/entity.js');
var Components = require('./Component/component.js');
var Systems = require('./System/system.js');

var soldier = Entities.addEntity();
soldier.addComponent(Components.createComponent('position', {x:0, y:0, z:0}));
soldier.addComponent(Components.createComponent('visible',
  {
    threeModelGeometry: new Three.BoxGeometry(1,1,1),
    threeMaterial: new Three.MeshBasicMaterial( { color: 0x00ff00 } ),
    threeModel: null
  }
));
soldier.addComponent(Components.createComponent('selectable'))

Systems.setupScene();
Systems.addEntitiesToScene(Entities.getEntities());
Systems.bindEntitiesToMouseClick(Entities.getEntities());

setInterval(function() {

  var entities = Entities.getEntities();

  //Systems.xYGravity(entities);
  Systems.render(entities);

}, 100)
