import Proton from "proton-engine";

class CustomEmitter extends Proton.Emitter {
    constructor(conf = {}) {
        super(conf);

        this.angle = 0;
        this.width = 600;
        this.height = 600;
        this.radius = 0;
        this.tha1 = 0;
        this.tha2 = 0;
        this.xorigin = this.width / 2;
        this.yorigin = this.height / 2;
        this.data.p = new Proton.Vector2D(this.xorigin, this.yorigin);
        this.speed = 0.025;
        this.formula = '5';
    }

    setFormula(formula) {
        this.formula = formula;
    }

    update(time) {
        super.update(time);
        this.running();
        this.calculatingAngle();
    }

    setupParticle(particle, initialize, behaviour) {
        super.setupParticle(particle, initialize, behaviour);
        particle.v.rotate(this.angle);
    }

    setOrigin(x, y) {
        this.xorigin = x;
        this.yorigin = y;
    }

    setSpeed(speed) {
        this.speed = parseFloat(speed);
    }

    calculateRadius(formula, theta) {
        formula = formula.replace('theta', theta);
        formula = formula.replace('sin', 'Math.sin');
        formula = formula.replace('cos', 'Math.cos');
        formula = formula.replace('tan', 'Math.tan');
        formula = formula.replace('sqrt', 'Math.sqrt');
        formula = formula.replace('abs', 'Math.abs');
        formula = formula.replace('log', 'Math.log');
        formula = formula.replace('exp', 'Math.exp');
        formula = formula.replace('pi', 'Math.PI');
        formula = formula.replace('e', 'Math.E');

        let r = eval(formula);
        return r;
    }

    heartshape(theta) {
        theta = theta + Math.PI;
        let r = (Math.sin(theta) * Math.sqrt(Math.abs(Math.cos(theta)))) / (Math.sin(theta) + (7 / 5));
        r = r + (-2 * Math.sin(theta) + 2);

        return 50 * r;
    }

    running() {
        this.radius = this.calculateRadius(this.formula, this.tha1);

        this.p.x = this.radius * Math.cos(this.tha1) + this.xorigin;
        this.p.y = this.radius * Math.sin(this.tha1) + this.yorigin;

        this.tha1 += this.speed;
    }

    calculatingAngle() {
        this.angle =
            Math.atan2(this.p.x - this.old.p.x, this.p.y - this.old.p.y) +
            Math.PI / 2;
        this.angle = -1 * this.tha1;
    }
}

export default CustomEmitter;
