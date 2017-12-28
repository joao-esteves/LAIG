'use strict';

class MyPiece {
    /**
     * 
     * @param {XMLscene} scene 
     * @param {string} type 
     * @param {string} color 
     */
    constructor(scene, type = null, color = null) {
        this.scene = scene;
        this.type = type;
        this.color = color;
        this.node = this._getPieceNode();

        this.animations = [];
        this.animationsStartTime = null;
    }

    clone() {
        return new MyPiece(this.scene, this.type, this.color);
    }

    /**
     * @param {string} str First char is type (K/Q/T/B/H), second is color (w/b).
     */
    setPiece(str) {
        if (str == "  ") {
            this.type = null;
            this.color = null;
            this.node = null;
            return;
        }
        
        this.type = str[0];
        this.color = str[1];
        
        this.node = this._getPieceNode();
    }

    pieceIsSet() {
        return this.node != null;
    }

    /**
     * Adds an animation to the Piece.
     * @param {Animation} anim
     */
    addAnimation(anim) {
        this.animations.push(anim);
    }

    /**
     * Gets the transformation matrix for the animation being run at a certain time.
     * @param {number} currentSeconds Seconds since the start of the first animation.
     */
    getAnimTransform(currentSeconds) {
        let elapsedTime = 0;
        for (let i = 0; i < this.animations.length; i++) {
            let animation = this.animations[i];
            if (elapsedTime + animation.totalTime > currentSeconds || i + 1 == this.animations.length) {
                let animT = (currentSeconds - elapsedTime) / animation.totalTime;
                return animation.getTransform(animT);
            }
            elapsedTime += animation.totalTime;
        }
        return null;
    }

    /**
     * 
     * @param {string} type 
     * @param {string} color 
     */
    _getPieceNode() {
        if (this.type == null || this.color == null || this.type == " " || this.color == " ") {
            return null;
        }

        let node = null;
        if (this.color == 'w') {
            switch (this.type) {
                case 'K':
                    node = this.scene.graph.nodes['whiteKing'];
                    break;
                case 'Q':
                    node = this.scene.graph.nodes['whiteQueen'];
                    break;
                case 'T':
                    node = this.scene.graph.nodes['whiteTower'];
                    break;
                case 'B':
                    node = this.scene.graph.nodes['whiteBishop'];
                    break;
                case 'H':
                    node = this.scene.graph.nodes['whiteHorse'];
                    break;
            }
        } else {
            switch (this.type) {
                case 'K':
                    node = this.scene.graph.nodes['blackKing'];
                    break;
                case 'Q':
                    node = this.scene.graph.nodes['blackQueen'];
                    break;
                case 'T':
                    node = this.scene.graph.nodes['blackTower'];
                    break;
                case 'B':
                    node = this.scene.graph.nodes['blackBishop'];
                    break;
                case 'H':
                    node = this.scene.graph.nodes['blackHorse'];
                    break;
            }
        }
        
        return node;
    }
}