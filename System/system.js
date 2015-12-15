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
      console.log(event)
      event.preventDefault();
      var mouse = {};
      mouse.x = ( event.clientX / _renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / _renderer.domElement.clientHeight ) * 2 + 1;

      _raycaster.setFromCamera( mouse, _camera );
      var objects = [];
      entities.forEach(function(entity, index, entities) {
        if(typeof entity.components.visible != 'undefined') {
          objects.push(entity.components.visible.state.threeModel)
        }
      });

      var intersects = _raycaster.intersectObjects( objects );

      if ( intersects.length > 0 ) {
        intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
        var particle = new Three.Sprite( new Three.MeshBasicMaterial( { color: 0x000000 } ) );
        particle.position.copy( intersects[ 0 ].point );
        particle.scale.x = particle.scale.y = 16;
        _scene.add( particle );
      }
    }

  },

  updateModelPositions: function(entities) {
    /*
    * Sets the model position equal to the entity's position within the framework
    */
    entities.forEach(function(entity, index, entities) {
      if(typeof entity.components.visible != 'undefined') {
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
    Systems.updateModelPositions(entities);
    _renderer.render( _scene, _camera );
  }
}

module.exports = Systems;
