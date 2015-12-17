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
    {path:Models.barracksModel(), name:'barracksModel'},
    {path:Models.panzerModel(), name:'panzerModel'}

  ],
function() {

  /*
  * Models loaded
  */

  EntityComposer.composeFloor();
  EntityComposer.composePanzerUnit({x:0, y:0, z:0}, true, Models.panzerModel()); //position, playable, 3dmodel
  EntityComposer.composeBarracks({x:-50, y:25, z:10}, false, Models.barracksModel()); //position, placeable, 3dmodel

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
