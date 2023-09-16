import * as THREE from 'three';

import Ledger, { IServerLedger } from '../../lib/client/ts/clientledger';
import { ifc2x3 } from './schema_ts/ts/ifc2x3_geometry';
import { UUID4 } from '../../lib/client/ts/ecs';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;



let server = new IServerLedger("localhost:3000", "ledger");
let ledger = new Ledger(server);


function ResolveBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}

const GEOM_TYPE_HASH = new ifc2x3.geometry(new UUID4()).getTypeHash();

ledger.SetNotifyHeadChanged(async (head: number) => {

    let commit = await ledger.GetCommit(head);

    let components = commit.diff?.updatedComponents;

    components?.forEach((comp) => {
        if (comp.id?.typeHash === GEOM_TYPE_HASH)
        {
            let geometryComponent = ifc2x3.geometry.importFromDataArray(comp);
            console.log("geom", geometryComponent.vertices, geometryComponent.indices);
        }
    })

    console.log(`fetched commit ${head}`);
})

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
