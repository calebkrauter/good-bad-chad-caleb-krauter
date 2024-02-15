/**
 * A slingshot that Chad holds and uses to launch projectiles. It can support various types of ammo.
 * @author Nathan Hinthorne
 */
class Slingshot {
    constructor() {
        this.isHidden = true;

        this.pos = Vector.add(CHAD.pos, new Vector(10, -10)); // temp value

        this.isFiring = false;
        this.rotation = 0;

        this.shootTimer = 0;

        this.playedStretchSound = false;

        this.start = new Vector(0, 0);
    }

    aim() {
        this.isHidden = false;

        // play the slingshot stretch sound
        if (!this.playedStretchSound) {
            ASSET_MGR.playAudio(SFX.SLINGSHOT_STRETCH.path, SFX.SLINGSHOT_STRETCH.volume);
            this.playedStretchSound = true;
        }

        // position the image near Chad's hand
        let x;
        let startY = this.start.y;
        if (CHAD.facing == "right") {
            x = CHAD.pos.x + 80;
            startY = 0; // slingshot facing right frame
        } else if (CHAD.facing == "left") {
            x = CHAD.pos.x - 80;
            // startY = 29; // slingshot facing left frame
        }
        this.pos = new Vector(x, CHAD.pos.y + 15);
        this.start = new Vector(0, startY);

        // find the angle in radians from the x axis to the mouse
        const delta = Vector.worldToCanvasSpace(Vector.subtract(GAME.mousePos, this.pos));
        let theta = Math.atan2(delta.y, delta.x);
        this.rotation = theta;

        //TODO: swap animation frames based on rotation

        // console.log("rotation: " + " (" + this.rotation * 180 / Math.PI + " degrees)");
    }

    fire() {
        ASSET_MGR.stopAudio(SFX.SLINGSHOT_STRETCH.path);

        // choose from 4 different firing sounds
        const rand = Math.floor(Math.random() * 4) + 1;
        const sfx = SFX["SLINGSHOT_LAUNCH" + rand];
        ASSET_MGR.playAudio(sfx.path, sfx.volume);

        this.isFiring = true;
        //this.startX = 26; // slingshot firing frame

        let ammoType = INVENTORY.useCurrentAmmo();
        if (ammoType != "Empty") {
            // create a projectile and launch it in the direction of the mouse
            GAME.addEntity(new Projectile(
                ammoType,
                Vector.round(this.pos),
                Vector.round(Vector.canvasToWorldSpace(GAME.mousePos))));
        }

        // trigger an async operation that will erase the slingshot after it fires
        setTimeout(() => {
            this.isFiring = false;
            this.isHidden = true;
            //TODO take out slingshot from chad's animation
        }, 1000);

        // reset the slingshot stretch sound
        this.playedStretchSound = false;

        // reset the shoot timer
        this.shootTimer = Slingshot.SHOOT_DELAY;
    }

    update() {
        if (this.shootTimer > 0) {
            this.shootTimer -= GAME.clockTick;
        }
        if (!HUD.pauseButton.isMouseOver()) {
            if (GAME.user.aiming) {
                this.aim();
            } else if (GAME.user.firing) {
                this.fire();
            }
        }
    }

    draw() {
        if (!this.isHidden) {
            CTX.drawImage(
                ASSET_MGR.getAsset(Slingshot.SPRITESHEET),
                this.start.x, this.start.y,
                Slingshot.SIZE.x, Slingshot.SIZE.y,
                this.pos.x - CAMERA.pos.x,
                this.pos.y - CAMERA.pos.y,
                Slingshot.SIZE.x * Slingshot.SCALE,
                Slingshot.SIZE.y * Slingshot.SCALE);
        }
    }

    /** The delay between shots in seconds */
    static get SHOOT_DELAY() {
        return 0.25;
    }

    static get SPRITESHEET() {
        return "./sprites/slingshot.png";
    }

    static get SIZE() {
        return new Vector(26, 29);
    }

    static get SCALE() {
        return 2.5;
    }

};