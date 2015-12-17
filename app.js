window.THREE = require('THREE');
window.$ = require('jquery');

var Entities = require('./Entity/entity.js');
var Components = require('./Component/component.js');
var Systems = require('./System/system.js');
var Models = require('./assets/models.js');
var EntityComposer = require('./Entity/entity-composer.js');

/*
* After our models are loaded, we start the game
*/
Models.loadModels([
    {path:Models.barracksModel(), name:'barracksModel'}
  ],
function() {

  /*
  * Models loaded
  */

  EntityComposer.composeFloor();
  EntityComposer.composePlayerUnit({x:0, y:0, z:0});
  EntityComposer.composeBarracks({x:-50, y:25, z:10});

  document.getElementById('addBlock').onclick = function() {
    Systems.addBlock();
  }
  Systems.setupScene();
  Systems.addEntitiesToScene(Entities.getEntities());
  Systems.bindMouseClick(Entities.getEntities());
  Systems.mouseMove(Entities.getEntities());

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

});
