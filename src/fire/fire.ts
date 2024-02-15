/**
 * @author mattatz / http://github.com/mattatz
 *
 * Ray tracing based real-time procedural volumetric fire object for js
 */
import {
    BoxGeometry,
    ClampToEdgeWrapping,
    Color,
    LinearFilter,
    Matrix4,
    Mesh,
    ShaderMaterial,
    Texture,
    UniformsUtils,
    Vector3, Vector4
} from "three";
import {FireShader} from "@/fire/fire-shader";

export function fire(fireTex: Texture, color: Color) {
    const fireMaterial = new ShaderMaterial( {
        defines         : FireShader.defines,
        uniforms        : UniformsUtils.clone(FireShader.uniforms),
        vertexShader    : FireShader.vertexShader,
        fragmentShader  : FireShader.fragmentShader,
        transparent     : true,
        depthWrite      : false,
        depthTest       : false
    } );

    // initialize uniforms

    fireTex.magFilter = fireTex.minFilter = LinearFilter;
    fireTex.wrapS = fireTex.wrapT = ClampToEdgeWrapping;

    fireMaterial.uniforms.fireTex.value = fireTex;
    fireMaterial.uniforms.color.value = color || new Color( 0xeeeeee );
    fireMaterial.uniforms.invModelMatrix.value = new Matrix4();
    fireMaterial.uniforms.scale.value = new Vector3( 1, 1, 1 );
    fireMaterial.uniforms.seed.value = Math.random() * 19.19;
    // fireMaterial.uniforms.rotation.value = Math.PI / 2;
    // @ts-ignore
    // const self = this as unknown as any;
    // Mesh.call(self, new BoxGeometry( 1.0, 1.0, 1.0 ), fireMaterial);
    const mesh = new Mesh(
        new BoxGeometry( 1.0, 1.0, 1.0 ),
        fireMaterial
    );
    return mesh;
}

export function update(time: number) {
    // @ts-ignore
    const self = this as unknown as any;
    const invModelMatrix = self.material.uniforms.invModelMatrix.value;
    self.updateMatrixWorld();
    // invModelMatrix.getInverse( self.matrixWorld );
    if( time !== undefined ) {
        self.material.uniforms.time.value = time;
    }
    self.material.uniforms.invModelMatrix.value = invModelMatrix;
    self.material.uniforms.scale.value = self.scale;
}
