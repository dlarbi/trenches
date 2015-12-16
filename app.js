window.Three = require('three');
var Entities = require('./Entity/entity.js');
var Components = require('./Component/component.js');
var Systems = require('./System/system.js');

var soldier = Entities.addEntity();
soldier.addComponent(Components.createComponent('position', {x:0, y:0, z:0}));
soldier.addComponent(Components.createComponent('visible',
  {
    threeModelGeometry: new Three.BoxGeometry(10,10,10),
    threeMaterial: new Three.MeshBasicMaterial( { color: 0x00ff00 } ),
    threeModel: null
  }
));
soldier.addComponent(Components.createComponent('selectable',{selected: false}));
soldier.addComponent(Components.createComponent('player', {damage: 10}));
soldier.addComponent(Components.createComponent('collides'));

soldier.addComponent(Components.createComponent('movableEntity',{destination:null, speed:0}));


var tower = Entities.addEntity();
tower.addComponent(Components.createComponent('position', {x:-50, y:25, z:0}))
tower.addComponent(Components.createComponent('visible',
  {
    threeModelGeometry: new Three.BoxGeometry(10,10,10),
    threeMaterial: new Three.MeshBasicMaterial( { color: 0x00ff00 } ),
    threeModel: null
  }
));
tower.addComponent(Components.createComponent('collides'));
tower.addComponent(Components.createComponent('health', {value:100, dead: false}));

tower.addComponent(Components.createComponent('enemy',
  {
    range: 50,
    damage:10
  }
));

Systems.setupScene();
Systems.addEntitiesToScene(Entities.getEntities());
Systems.bindEntitiesToMouseClick(Entities.getEntities());

setInterval(function() {

  var entities = Entities.getEntities();

  Systems.moveEntitiesToDestination(entities);
  Systems.collisionDetection(entities);
  //Systems.xYGravity(entities);

  Systems.enemiesAttack(entities);
  Systems.highlightSelected(entities);
  Systems.updateModelPositions(entities);
  Systems.removeDeadEntities(entities);
  Systems.render(entities);

}, 100);
