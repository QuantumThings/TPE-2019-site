if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var container, stats;
var camera, cameraTarget, scene, renderer;
init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10 );
	camera.position.set( 0, 3, 0 );
	cameraTarget = new THREE.Vector3( 0, 0, 0 );
	scene = new THREE.Scene();
	// ASCII file
	var loader = new THREE.STLLoader();
	loader.load( 'models/maison2.stl', function ( geometry ) {
		var material = new THREE.MeshPhongMaterial( { color: 0x1111ff, specular: 0x010101, shininess: 50 } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( -Math.PI/10, 0, 0 );
		mesh.rotation.set( Math.PI/2, Math.PI, 0);
		mesh.scale.set( 0.01, 0.01, 0.01 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
	} );
	// Lights
	scene.add( new THREE.HemisphereLight( 0xffffff, 0xffffff ) );
	addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
	addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );
	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );
	// stats
	stats = new Stats();
	container.appendChild( stats.dom );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function addShadowedLight( x, y, z, color, intensity ) {
	var directionalLight = new THREE.DirectionalLight( color, intensity );
	directionalLight.position.set( x, y, z );
	scene.add( directionalLight );
	directionalLight.castShadow = true;
	var d = 1;
	directionalLight.shadow.camera.left = - d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = - d;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 4;
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.bias = - 0.002;
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}
function render() {
	var timer = Date.now() * 0.0005
	camera.position.x = Math.cos( timer ) * 3;
	camera.position.z = Math.sin( timer ) * 3;
	camera.lookAt( cameraTarget );
	renderer.render( scene, camera );
}