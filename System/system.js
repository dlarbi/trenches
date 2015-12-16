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
        if(typeof entity.components.visible != 'undefined' && typeof entity.components.selectable != 'undefined') {
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
          * We have the entity we clicked in objects[i][1], so we set it's state to selected
          */
          objects[i][1].components.selectable.state.selected = true;
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
          console.log(entities)
          if(entity.components.selectable.state.selected && typeof entity.components.movableUnit != 'undefined') {

            entity.components.movableUnit.state.destination = [mouse.x*vectorScale, mouse.y*vectorScale/2, 0]
            entity.components.movableUnit.state.speed = 5
          }
        });
      }
    }

  },

  moveUnitsToDestination: function(entities) {
    entities.forEach(function(entity, index, entities) {
      /*
      * We build a unit vector out of the entity's current position, and its destination position
      * We then increment the entity's position by the vector quantities each frame, until the destination & position coordinates match
      * We multiply the unit vector by the scalar 'speed' to define how fast the entity moves
      */
      if(typeof entity.components.position != 'undefined') {
        //console.log(entity.components.position.state);
        if(typeof entity.components.movableUnit != 'undefined') {
          //console.log(entity.components.movableUnit.state.vector)
          var destX = entity.components.movableUnit.state.destination[0];
          var destY = entity.components.movableUnit.state.destination[1];
          var posX = entity.components.position.state.x;
          var posY = entity.components.position.state.y;
          var vector = new Three.Vector3(destX-posX, (destY-posY), 0)
          vector.normalize();
          if(Math.abs(destX-posX) > 10 || Math.abs(destY-posY) > 10) {
            entity.components.position.state.x+=vector.x*entity.components.movableUnit.state.speed;
            entity.components.position.state.y+=vector.y*entity.components.movableUnit.state.speed;
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
