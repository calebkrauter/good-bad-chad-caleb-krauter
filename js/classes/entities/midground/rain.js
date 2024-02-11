class Rain {
    constructor(dir, pos) {
        // TODO use direction to rotate raindrop and choose different travel path.
        this.dir = dir;
        this.origin = pos;
        this.pos = pos;
        this.velocity = new Vector(0, 0);
        Rain.spriteSheet = Rain.SPRITESHEET_DOWN;
        if (dir == "down") {
            Rain.spriteSheet = Rain.SPRITESHEET_DOWN;
        } else if (dir == "left") {
            Rain.spriteSheet = Rain.SPRITESHEET_LEFT;
        } else if (dir == "right") {
            Rain.spriteSheet = Rain.SPRITESHEET_RIGHT;
        }
        this.animator = new Animator(Rain.spriteSheet, new Vector(0, 0), new Vector(Rain.SIZE.x, Rain.SIZE.y), 1, 1);
        this.hasStartedRaining = false;
        this.stopRain = false;
    }
    static get SPRITESHEET_DOWN() {
        return "./sprites/rain_drop.png";

    }
    static get SPRITESHEET_LEFT() {
        return "./sprites/rain_drop_left.png";

    }
    static get SPRITESHEET_RIGHT() {
        return "./sprites/rain_drop_right.png";

    }
    static get SIZE() {
        return new Vector(16, 16);
    }
    static get SCALE() {
        if (this.dir == "down") {
            return 2.5;
        } else {
            return 1.8;
        }
    }

    reset() {
        let variationY = Math.random() * (50 + 100) - 50;
        // Ensure that the rain covers the screen when resetting its origin.
        let variationX = Math.random() * (1920 + 1920);
        // We use CHAD.pos.x - 1920 to ensure that the rain follows Chad and that the rain begins at the left of the screen as it covers it.
        this.pos = new Vector(variationX + CHAD.pos.x - 1920, this.origin.y + variationY);
        this.velocity = new Vector(0, 0);


    }

    /**
     * @author Caleb Krauter and Trae Claar
     */
    update() {
        this.velocity.y = PHYSICS.GRAVITY_ACC * GAME.clockTick;
        if (this.dir == "left") {
            this.velocity.x = -(PHYSICS.GRAVITY_ACC * GAME.clockTick - 5);
        } else if (this.dir == "right") {
            this.velocity.x = (PHYSICS.GRAVITY_ACC * GAME.clockTick - 5);

        }

        if (this.velocity.y > PHYSICS.TERMINAL_VELOCITY) {
            this.velocity.y = PHYSICS.TERMINAL_VELOCITY;
        }
        this.velocity = new Vector(this.velocity.x, this.velocity.y);
        this.pos = Vector.add(this.pos, this.velocity);


        if (!this.stopRain) {
            // Reset rain when it goes to low. It will always be reset within the frame width.
            if (this.pos.y > (CHAD.pos.y + 800)) {
                this.reset();
            }
        }

    }

    draw() {
        this.animator.drawFrame(Vector.worldToCanvasSpace(this.pos), Rain.SCALE);

    }
}