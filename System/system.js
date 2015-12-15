var _renderer = null;
var _scene = null;
var _camera = null;
var _raycaster = null;

var Systems = {

  setupScene: function() {
    _scene = new Three.Scene();
    _camera = new Three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    _renderer = new Three.WebGLRenderer();
    _raycaster = new Three.Raycaster();
    _renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('trenches-game').appendChild( _renderer.domElement );
    _camera.position.z = 50;
  },

  addEntitiesToScene: function(entities) {
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

  mouseClicksOn: function() {
    document.getElementById('trenches-game').onclick = function(event) {
      console.log(event)
      event.preventDefault();
      var mouse = {};
      mouse.x = ( event.clientX / _renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / _renderer.domElement.clientHeight ) * 2 + 1;

      _raycaster.setFromCamera( mouse, _camera );

      var intersects = _raycaster.intersectObjects( objects );

      if ( intersects.length > 0 ) {

        intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

        var particle = new THREE.Sprite( particleMaterial );
        particle.position.copy( intersects[ 0 ].point );
        particle.scale.x = particle.scale.y = 16;
        _scene.add( particle );

      }
    }

  },

  updateModelPositions: function(entities) {
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


  render: function() {
    _renderer.render( _scene, _camera );
  }
}

module.exports = Systems;
