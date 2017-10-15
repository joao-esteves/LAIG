/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, height, topRadius, bottomRadius, stacks, slices, topCover, bottomCover) {
	CGFobject.call(this, scene);

	this.height = height;
	this.topRadius = topRadius;
	this.bottomRadius = bottomRadius;
	this.slices = slices;
	this.stacks = stacks;
	this.topCover = topCover;
	this.bottomCover = bottomCover;

	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

function calculateAng(n) {
	return 2 * Math.PI / n;
}

MyCylinder.prototype.initBuffers = function () {

	var ang = calculateAng(this.slices);
	var stack_height = 1/this.stacks;

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	for (let j = 0; j <= this.stacks; j++) {
		let radius = this.bottomRadius+(this.topRadius-this.bottomRadius)/(this.stacks-j+1);
		for (i = 0; i < this.slices; i++) {
			let x = Math.cos(ang * i)*radius;
			let y = Math.sin(ang * i)*radius;
			let z = j*stack_height*this.height;
			this.vertices.push(x, y, z);
			this.texCoords.push(i/this.slices, j);
		}
	}

	for (let j = 0; j <= this.stacks; j++) {
		for (i = 0; i < this.slices; i++) {
		    this.normals.push(Math.cos(ang * i), Math.sin(ang * i), 0);
		}
	}

	let vertsPerRing = this.slices;
	for (let j = 0; j < this.stacks; j++) {
		for (i = 0; i < this.slices; i++) {
			this.indices.push(j*vertsPerRing + i % vertsPerRing, (j+1)*vertsPerRing + (i + 1) % vertsPerRing, (j+1)*vertsPerRing + i % vertsPerRing);
			this.indices.push(j*vertsPerRing + i % vertsPerRing, j*vertsPerRing + (i + 1) % vertsPerRing, (j+1)*vertsPerRing + (i + 1) % vertsPerRing);
		}
	}

	let firstBaseInd = this.vertices.length / 3;
	if (this.topCover) {
		this.vertices.push(0, 0, this.height);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);
		let radius = this.topRadius;
		for (let i = 0; i < this.slices; i++) {
			let x = Math.cos(ang * i)*radius;
			let y = Math.sin(ang * i)*radius;
			let z = this.height;
			this.vertices.push(x, y, z);
			this.normals.push(0, 0, 1);
			let s = (radius * Math.cos(ang * i) + 1) / 2;
			let t = (radius * Math.sin(ang * i) + 1) / 2;
			this.texCoords.push(s, t);
		}
		for (let i = 0; i < this.slices; i++) {
			this.indices.push(firstBaseInd, firstBaseInd + 1 + i, firstBaseInd + 1 + (1 + i) % vertsPerRing);
		}
		firstBaseInd = this.vertices.length / 3;
	}
	if (this.bottomCover) {
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, -1);
		this.texCoords.push(0.5, 0.5);
		let radius = this.bottomRadius;
		for (let i = 0; i < this.slices; i++) {
			let x = Math.cos(ang * i)*radius;
			let y = Math.sin(ang * i)*radius;
			let z = 0;
			this.vertices.push(x, y, z);
			this.normals.push(0, 0, -1);
			let s = (radius * Math.cos(ang * i) + 1) / 2;
			let t = (radius * Math.sin(ang * i) + 1) / 2;
			this.texCoords.push(s, t);
		}
		for (let i = 0; i < this.slices; i++) {
			this.indices.push(firstBaseInd, firstBaseInd + 1 + (1 + i) % vertsPerRing, firstBaseInd + 1 + i);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};


