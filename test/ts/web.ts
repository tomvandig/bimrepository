import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Ledger, { IServerLedger } from '../../lib/client/ts/clientledger';
import { ifc2x3 } from './schema_ts/ts/ifc2x3_geometry';
import { UUID4 } from '../../lib/client/ts/ecs';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
scene.background = new THREE.Color(255, 255, 255);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 2);
directionalLight.target = cube;
directionalLight.translateX(1);
directionalLight.translateY(1);
directionalLight.translateZ(1);
scene.add( directionalLight );
const light = new THREE.AmbientLight( 0xA0A0A0 ); // soft white light
scene.add( light );
camera.position.z = 50;



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

let entityToGeom = new Map<string, THREE.Object3D>();

let previousReceivedCommit = -1;
async function NewHead(head: number)
{
    for (let commitID = previousReceivedCommit + 1; commitID <= head; commitID++)
    {
        let commit = await ledger.GetCommit(commitID);

        let components = commit.diff?.updatedComponents;

        components?.forEach((comp) => {
            if (comp.id?.typeHash === GEOM_TYPE_HASH)
            {

                let geometryComponent = ifc2x3.geometry.importFromDataArray(comp);
                console.log("geom", geometryComponent.vertices, geometryComponent.indices);

                // remove existing geom if exists
                let entityString = geometryComponent.getEntityID().bytes.toString();
                if (entityToGeom.has(entityString))
                {
                    let obj = entityToGeom.get(entityString);
                    scene.remove(obj!);
                    entityToGeom.delete(entityString);
                }

                const geometry = new THREE.BufferGeometry();

                let floats = new Float32Array(geometryComponent.vertices);
                let colors = new Float32Array(geometryComponent.colors);

                // itemSize = 3 because there are 3 values (components) per vertex
                geometry.setAttribute( 'position', new THREE.BufferAttribute( floats, 3 ) );
                geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
                geometry.setIndex(geometryComponent.indices);
                geometry.computeVertexNormals();

                const material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA } );
                material.vertexColors = true;
                const mesh = new THREE.Mesh( geometry, material );
                scene.add(mesh);
            
                entityToGeom.set(entityString, mesh);
            }
        })

        console.log(`fetched commit ${commitID}`);
    }

    previousReceivedCommit = head;
}

ledger.SetNotifyHeadChanged(async (head: number) => {
    // TODO: fix, apparently head is a string here
    //@ts-ignore
    NewHead(parseInt(head ));
});

function animate() {
	controls.update();
    requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
