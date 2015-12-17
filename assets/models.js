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
    var floorGeometry = new Three.PlaneBufferGeometry(300, 300, 300, 300);
    var textureLoader    = new Three.TextureLoader();
    var texture = textureLoader.load("client/assets/images/dirt.jpg");
    texture.wrapS = texture.wrapT = Three.RepeatWrapping;
    texture.repeat.set( 8, 8 );

    var material = new Three.MeshBasicMaterial( { map:texture } );
    var floor = new Three.Mesh(floorGeometry, material);
    floor.position.y = 0;
    //floor.rotation.x = -Math.PI / 2;
    return {
      threeModelGeometry: floorGeometry,
      threeMaterial: material,
      threeModel: floor
    };
  },

  cube3d : function() {
    var geometry = new Three.BoxGeometry( .4, .4, .4);
    var material = new Three.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new Three.Mesh( geometry, material );
    return {
      threeModelGeometry: geometry,
      threeMaterial: material,
      threeModel: cube
    };
  },

  starrySky : function() {
    var imagePrefix = "../../../images/galaxy";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".jpg";
    var skyGeometry = new Three.BoxGeometry( 2, 2, 2 );

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
      materialArray.push( new Three.MeshBasicMaterial({
        map: Three.ImageUtils.loadTexture( imagePrefix + imageSuffix ),
        side: Three.BackSide
      }));
    }

    var skyMaterial = new Three.MeshFaceMaterial( materialArray );
    var skyBox = new Three.Mesh( skyGeometry, skyMaterial );
    return {
      threeModelGeometry: skyGeometry,
      threeMaterial: skyMaterial,
      threeModel: skyBox
    };
  },

  renderedMapFromMatrix : function(Map) {

  },

  cityScape : function() {
    var imagePrefix = "../../../images/city_";
    var directions  = ["right", "left", "top", "yneg", "front", "back"];
    var imageSuffix = ".jpg";
    var skyGeometry = new Three.BoxGeometry( 2, 2, 2 );

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
      materialArray.push( new Three.MeshBasicMaterial({
        map: Three.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
        side: Three.BackSide
      }));
    }

    var skyMaterial = new Three.MeshFaceMaterial( materialArray );
    var skyBox = new Three.Mesh( skyGeometry, skyMaterial );
    return {
      threeModelGeometry: skyGeometry,
      threeMaterial: skyMaterial,
      threeModel: skyBox
    };
  },

  desert : function() {
    var imagePrefix = "../../../images/desert_";
    var directions  = ["right", "left", "top", "yneg", "front", "back"];
    var imageSuffix = ".jpg";
    var skyGeometry = new Three.BoxGeometry( 2, 2, 2 );

    var materialArray = [];
    for (var i = 0; i < 6; i++) {
      materialArray.push( new Three.MeshBasicMaterial({
        map: Three.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
        side: Three.BackSide
      }));
    }

    var skyMaterial = new Three.MeshFaceMaterial( materialArray );
    var skyBox = new Three.Mesh( skyGeometry, skyMaterial );
    return {
      threeModelGeometry: skyGeometry,
      threeMaterial: skyMaterial,
      threeModel: skyBox
    };
  },

  loadModels: function(files, callback) {
    var i = 0;
    var loader2 = new Three.ObjectLoader();

    files.forEach(function(file){
      loader2.load(file.path, function (geometry) {
        i++;
        console.log(geometry)
        geometry.rotation.x = Math.PI/2
        Models[file.name] = function() {
          return geometry;
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
