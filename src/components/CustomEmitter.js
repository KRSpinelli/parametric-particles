import Proton from "proton-engine";

class CustomEmitter extends Proton.Emitter {
    constructor(conf = {}) {
        super(conf);

        this.angle = 0;
        this.width = conf.width || 600;
        this.height = conf.height || 600;
        this.radius = 0;
        this.theta = 0;
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

    setDrawSpeed(speed) {
        this.speed = parseFloat(speed);
    }

    convertFormula(formulaToConvert, theta) {
        formulaToConvert = formulaToConvert.replaceAll('theta', theta);
        formulaToConvert = formulaToConvert.replaceAll('e', 'Math.E');
        formulaToConvert = formulaToConvert.replaceAll('sin', 'Math.sin');
        formulaToConvert = formulaToConvert.replaceAll('cos', 'Math.cos');
        formulaToConvert = formulaToConvert.replaceAll('tan', 'Math.tan');
        formulaToConvert = formulaToConvert.replaceAll('sqrt', 'Math.sqrt');
        formulaToConvert = formulaToConvert.replaceAll('abs', 'Math.abs');
        formulaToConvert = formulaToConvert.replaceAll('log', 'Math.log');
        formulaToConvert = formulaToConvert.replaceAll('exp', 'Math.exp');
        formulaToConvert = formulaToConvert.replaceAll('pi', 'Math.PI');
        return formulaToConvert;
    }

    calculateRadius(formula, theta) {
        return eval(this.convertFormula(formula, theta));
    }

    heartshape(theta) {
        theta = theta + Math.PI;
        let r = (Math.sin(theta) * Math.sqrt(Math.abs(Math.cos(theta)))) / (Math.sin(theta) + (7 / 5));
        r = r + (-2 * Math.sin(theta) + 2);

        return 50 * r;
    }

    running() {
        this.radius = this.calculateRadius(this.formula, this.theta);

        this.p.x = this.radius * Math.cos(this.theta) + this.xorigin;
        this.p.y = this.radius * Math.sin(this.theta) + this.yorigin;

        this.theta += this.speed;
    }

    calculatingAngle() {
        this.angle = -1 * this.theta;
    }
}

export default CustomEmitter;
