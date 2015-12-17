var Models = {

  singlePixel : function(x,y,z) {
    var pixels = [
      {
        x:x,
        y:y,
        z:z,
        color:[0, 1, 0, 255]
      }
    ];
    return pixels;
  },

  flatFloor : function() {
    var floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 300, 300);
    var textureLoader    = new THREE.TextureLoader();
    var texture = textureLoader.load("client/assets/images/dirt.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 8, 8 );

    var material = new THREE.MeshBasicMaterial( { map:texture } );
    var floor = new THREE.Mesh(floorGeometry, material);
    floor.position.y = 0;
    //floor.rotation.x = -Math.PI / 2;
    return {
      THREEModelGeometry: floorGeometry,
      THREEMaterial: material,
      THREEModel: floor
    };
  },

  cube3d : function() {
    var geometry = new THREE.BoxGeometry( .4, .4, .4);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    return {
      THREEModelGeometry: geometry,
      THREEMaterial: material,
      THREEModel: cube
    };
  },

  starrySky : function() {
    var imagePrefix = "../../../images/galaxy";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.BoxGeometry( 2, 2, 2 );

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
      materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( imagePrefix + imageSuffix ),
        side: THREE.BackSide
      }));
    }

    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    return {
      THREEModelGeometry: skyGeometry,
      THREEMaterial: skyMaterial,
      THREEModel: skyBox
    };
  },

  renderedMapFromMatrix : function(Map) {

  },

  cityScape : function() {
    var imagePrefix = "../../../images/city_";
    var directions  = ["right", "left", "top", "yneg", "front", "back"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.BoxGeometry( 2, 2, 2 );

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
      materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
        side: THREE.BackSide
      }));
    }

    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    return {
      THREEModelGeometry: skyGeometry,
      THREEMaterial: skyMaterial,
      THREEModel: skyBox
    };
  },

  desert : function() {
    var imagePrefix = "../../../images/desert_";
    var directions  = ["right", "left", "top", "yneg", "front", "back"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.BoxGeometry( 2, 2, 2 );

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
      materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
        side: THREE.BackSide
      }));
    }

    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    return {
      THREEModelGeometry: skyGeometry,
      THREEMaterial: skyMaterial,
      THREEModel: skyBox
    };
  },

  loadModels: function(files, callback) {
    var i = 0;
    var loader2 = new THREE.ObjectLoader();

    files.forEach(function(file){
      loader2.load(file.path, function (geometry) {
        i++;
        console.log(geometry)
        geometry.rotation.x = Math.PI/2
        Models[file.name] = function() {
          var newGeometry = geometry.clone()
          return newGeometry;
        };
        if (i == files.length) {
          callback();
        }
      });
    });
  },

  barracksModel: function() {
    return 'client/assets/json_models/barracks.json'
  }

};

module.exports = Models;
