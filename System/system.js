var Entities = require('../Entity/entity.js');
var Components = require('../Component/component.js');

var _renderer = null;
var _scene = null;
var _camera = null;
var _raycaster = null;

var Systems = {

  setupScene: function() {
    /*
    * Setup camera, renderer, scene, etc required to render our game.  Append canvas to DOM.
    * Handles to variables like _camera are used throughout different System methods.
    */

    _scene = new Three.Scene();
    _camera = new Three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    _renderer = new Three.WebGLRenderer();
    _raycaster = new Three.Raycaster();
    _renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('trenches-game').appendChild( _renderer.domElement );
    _camera.position.z = 50;
  },

  addEntitiesToScene: function(entities) {
    /*
    * Called at initialization to add the initial entities to the world.
    * Sets their geometry, model, etc.
    */
    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.visible != 'undefined') {
        var geometry = entity.components.visible.state.threeModelGeometry;
        var material = entity.components.visible.state.threeMaterial;
        var model = new Three.Mesh( geometry, material );
        entity.components.visible.state.threeModel = model;
        _scene.add( model );
      }
    });
  },

  bindEntitiesToMouseClick: function(entities) {
    /*
    * This function should be called whenever clickable entities are added to the world.
    * It decides whether click events intersect with rendered models using a raycaster.
    */

    document.getElementById('trenches-game').onclick = null;
    document.getElementById('trenches-game').onclick = function(event) {
      event.preventDefault();
      var mouse = {};
      mouse.x = ( event.clientX / _renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / _renderer.domElement.clientHeight ) * 2 + 1;

      _raycaster.setFromCamera( mouse, _camera );
      var objects = [];
      entities.forEach(function(entity, index, entities) {
        if(typeof entity.components.visible != 'undefined' && typeof entity.components.selectable != 'undefined' || typeof entity.components.enemy != 'undefined') {
          /*
          * We push an array [threeModel, entityId] so we can associate the clicked model with the entity
          */
          objects.push([entity.components.visible.state.threeModel, entity])
        }
      });
      var wasModelClicked = false;
      for(var i=0;i<objects.length;i++) {
        var intersects = _raycaster.intersectObjects( [objects[i][0]] );
        if ( intersects.length > 0 ) {
          /*
          * We have the entity we clicked in objects[i][1], so we set it's state to selected if it is selectable,
          * else if we have clicked on an enemy entity, we attack him
          */
          if(typeof objects[i][1].components.selectable != 'undefined') {
            objects[i][1].components.selectable.state.selected = true;
          } else if(typeof objects[i][1].components.enemy != 'undefined') {
            console.log('attack that guy')
            Systems.attackEnemy(objects[i][1], entities);
          }
          wasModelClicked = true;
        }
      }
      if(!wasModelClicked && objects.length) {
        /*
        * We haven't clicked any models, so we're going to set our mouse location to the destination state
        * of any entities that are selected and moveable
        */
        var vectorScale = 100;

        entities.forEach(function(entity, index, entities) {
          var isSelectedMovableEntities = typeof entity.components.selectable != 'undefined' && entity.components.selectable.state.selected && typeof entity.components.movableEntity != 'undefined';
          if(isSelectedMovableEntities) {
            entity.components.movableEntity.state.destination = [mouse.x*vectorScale, mouse.y*vectorScale/2, 0]
            entity.components.movableEntity.state.speed = 5
          }
        });
      }
    }

  },

  moveEntitiesToDestination: function(entities) {

    entities.forEach(function(entity, index, entities) {

      /*
      * We build a unit vector out of the vector between the entity's position coordinates, and its destination coordinates
      * We then increment the entity's position coordinates by the unit vector quantities each frame, until the destination & position coordinates match
      * We multiply the unit vector by the scalar 'speed' to define how fast the entity moves
      */
      if(typeof entity.components.position != 'undefined') {
        if(typeof entity.components.movableEntity != 'undefined' && entity.components.movableEntity.state.destination) {
          //console.log(entity.components.movableEntity.state.vector)
          var destX = entity.components.movableEntity.state.destination[0];
          var destY = entity.components.movableEntity.state.destination[1];
          var posX = entity.components.position.state.x;
          var posY = entity.components.position.state.y;
          var vector = new Three.Vector3(destX-posX, (destY-posY), 0)
          vector.normalize();
          /*
          * If the entity has not reached its destination we move towards the destination,
          * else we set the destination to null so we don't build a new movement vector in the next frame
          */
          if(Math.abs(destX-posX) > 10 || Math.abs(destY-posY) > 10) {
            entity.components.position.state.x+=vector.x*entity.components.movableEntity.state.speed;
            entity.components.position.state.y+=vector.y*entity.components.movableEntity.state.speed;
          } else {
            entity.components.movableEntity.state.destination = null;
          }

        }
      }
    });
  },

  highlightSelected: function(entities) {
    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.selectable != 'undefined') {
        if(entity.components.selectable.state.selected) {
          entity.components.visible.state.threeMaterial.color.setHex(Math.random() * 0xffffff)
        }
      }
    });
  },

  updateModelPositions: function(entities) {

    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.position != 'undefined') {

        /*
        * Sets the model position equal to the entity's position within the framework
        */
        entity.components.visible.state.threeModel.position.x = entity.components.position.state.x;
        entity.components.visible.state.threeModel.position.y = entity.components.position.state.y;

      }

    });
  },

  enemiesAttack: function(entities) {
    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.enemy != 'undefined') {
        var inRadius = false;
        entities.forEach(function(entityInner, indexInner, entitiesInner) {
          if(typeof entityInner.components.player != 'undefined') {
            var playerX = entityInner.components.position.state.x;
            var playerY = entityInner.components.position.state.y;
            var enemyX = entity.components.position.state.x;
            var enemyY = entity.components.position.state.y;
            var attackRange = entity.components.enemy.state.range

            if(Math.abs(playerX-enemyX) < attackRange && Math.abs(playerY-enemyY) < attackRange) {
              /*
              var projectile = Entities.addEntity();
              projectile.addComponent(Components.createComponent('position', {x:enemyX, y:enemyY, z:0}));
              projectile.addComponent(Components.createComponent('visible',
                {
                  threeModelGeometry: new Three.BoxGeometry(.5,.5,.5),
                  threeMaterial: new Three.MeshBasicMaterial( { color: 0x00ff00 } ),
                  threeModel: null
                }
              ));
              projectile.addComponent(Components.createComponent('collides'));
              projectile.addComponent(Components.createComponent('projectile', {damage: entity.components.enemy.state.damage}));
              projectile.addComponent(Components.createComponent('movableEntity',{destination:[playerX, playerY, 0], speed:5}));
              Systems.addEntitiesToScene([projectile]);
              */
            }

          }
        });
      }
    });
  },

  attackEnemy: function(enemy, allEntities) {
    console.log(enemy)
    allEntities.forEach(function(entity, index, allEntities) {
      var isSelectedEntity = typeof entity.components.selectable != 'undefined' && entity.components.selectable.state.selected;
      if(isSelectedEntity) {
        var enemyX = enemy.components.position.state.x;
        var enemyY = enemy.components.position.state.y;
        var playerX = entity.components.position.state.x;
        var playerY = entity.components.position.state.y;
        var attackRange = 50 //entity.components.enemy.state.range

        if(Math.abs(playerX-enemyX) < attackRange && Math.abs(playerY-enemyY) < attackRange) {
          var projectile = Entities.addEntity();
          projectile.addComponent(Components.createComponent('position', {x:playerX+10, y:playerY+10, z:0}));
          projectile.addComponent(Components.createComponent('visible',
            {
              threeModelGeometry: new Three.BoxGeometry(.5,.5,.5),
              threeMaterial: new Three.MeshBasicMaterial( { color: 0x00ff00 } ),
              threeModel: null
            }
          ));
          projectile.addComponent(Components.createComponent('collides'));
          projectile.addComponent(Components.createComponent('projectile', {damage: entity.components.player.state.damage}));
          projectile.addComponent(Components.createComponent('movableEntity',{destination:[enemyX, enemyY, 0], speed:5}));
          Systems.addEntitiesToScene([projectile]);
        }
      }
    });
  },

  collisionDetection: function(entities) {
    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.position != 'undefined' && typeof entity.components.collides != 'undefined') {
        entities.forEach(function(innerEntity, innerIndex, innerEntities){
          if(innerEntity.id != entity.id) {
            if(typeof innerEntity.components.position != 'undefined' && typeof innerEntity.components.collides != 'undefined') {
              var pos1X = entity.components.position.state.x;
              var pos1Y = entity.components.position.state.y;
              var pos2X = innerEntity.components.position.state.x;
              var pos2Y = innerEntity.components.position.state.y;
              if(Math.abs(pos1X-pos2X) < 10 && Math.abs(pos1Y-pos2Y) < 10) {
                Systems.collision([innerEntity, entity]);
              }
            }
          }
        })
      }

    });
  },

  collision: function(entities) {
    entities.forEach(function(entity, index, entities) {
      /*
      * If its a projectile colliding, we administer damage and remove it from the world
      */
      if(typeof entity.components.projectile != 'undefined') {
        console.log(entity.components.projectile.state.damage, 'DAMAGE')
        Entities.removeEntityById(entity.id);
        _scene.remove(entity.components.visible.state.threeModel)
      }
    });
  },

  xYGravity: function(entities){
    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.position != 'undefined') {
        console.log(entity.components.position.state);
        entity.components.position.state.x++;
        entity.components.position.state.y++;

      }
    });
  },


  render: function(entities) {
    _renderer.render( _scene, _camera );
  }
}

module.exports = Systems;
