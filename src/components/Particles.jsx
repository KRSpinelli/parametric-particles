import React from "react";
import Proton from "proton-engine";
import RAFManager from "raf-manager";
import Canvas from "./Canvas";
import CustomEmitter from "./CustomEmitter";

export default class Particles extends React.Component {
    constructor(props) {
        super(props);
        this.hue = 0;
        this.drawCircle = true;
        this.drawEnabled = false;
        this.colorTemplate = `hsla(hue,80%,50%, 0.9)`;
        this.renderProton = this.renderProton.bind(this);
        this.size = props.size;
        this.speed = props.speed;
        this.formula = props.formula;
    }

    handleCanvasInited(canvas) {
        this.emitterType = Proton.getSpan([3, 4, 5]).getValue();
        this.canvas = canvas;
        setTimeout(() => (this.drawEnabled = true), 200);
        this.createProton(canvas);
        RAFManager.add(this.renderProton);
    }

    clearCanvas() {
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.speed !== this.props.speed && this.emitter) {
            this.emitter.setSpeed(this.props.speed);
        }

        if (prevProps.formula !== this.props.formula && this.emitter) {
            this.emitter.setFormula(this.props.formula);
        }

        if (prevProps.size !== this.props.size && this.emitter) {
            if (this.radiusInitializer) {
                this.emitter.removeInitialize(this.radiusInitializer);
                this.radiusInitializer = new Proton.Radius(this.props.size, this.props.size * 1.5);
                this.emitter.addInitialize(this.radiusInitializer);
            }
        }
    }

    componentWillUnmount() {
        try {
            RAFManager.remove(this.renderProton);
            this.proton.destroy();
        } catch (e) { }
    }

    createProton(canvas) {
        const proton = new Proton();
        const emitter = new CustomEmitter();
        emitter.damping = 0.00001;
        emitter.rate = new Proton.Rate(
            Proton.getSpan(13, 15),
            Proton.getSpan(0.01, 0.03)
        );
        emitter.setSpeed(this.props.speed);
        emitter.addInitialize(new Proton.Mass(1));
        console.log('Size: ', this.props.size);

        this.radiusInitializer = new Proton.Radius(this.props.size, this.props.size * 1.5);
        emitter.addInitialize(this.radiusInitializer);

        emitter.addInitialize(new Proton.Life(3, 3.5));
        emitter.addInitialize(
            new Proton.Velocity(
                Proton.getSpan(1.5, 2.5),
                90,
                "polar"
            )
        );

        const crossZoneBehaviour = new Proton.CrossZone(
            new Proton.RectZone(0, 0, canvas.width, canvas.height),
            "dead"
        );
        emitter.addBehaviour(crossZoneBehaviour);
        emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.02));
        emitter.addBehaviour(new Proton.Scale(1, 0.1));

        emitter.width = canvas.width;
        emitter.height = canvas.height;
        proton.addEmitter(emitter);
        emitter.emit();

        const renderer = this.createRenderer(canvas);
        proton.addRenderer(renderer);
        //Proton.Debug.drawEmitter(proton, canvas, emitter);

        this.proton = proton;
        this.renderer = renderer;
        this.emitter = emitter;
        this.crossZoneBehaviour = crossZoneBehaviour;
    }

    createRenderer(canvas) {
        const context = canvas.getContext("2d");
        const renderer = new Proton.CanvasRenderer(canvas);
        renderer.onProtonUpdate = () => {
            this.hue += 1;
            context.fillStyle = "rgba(0, 0, 0, 0.015)";
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        renderer.onParticleCreated = particle => {
            particle.color = this.colorTemplate.replace("hue", this.hue % 360);
        };

        renderer.onParticleUpdate = particle => {
            if (!this.drawEnabled) return;
            if (this.drawCircle) {
                context.beginPath();
                context.fillStyle = particle.color;
                context.arc(
                    particle.p.x,
                    particle.p.y,
                    particle.radius,
                    0,
                    Math.PI * 2,
                    true
                );
                context.closePath();
                context.fill();
            } else {
                context.beginPath();
                context.strokeStyle = particle.color;
                context.moveTo(particle.old.p.x, particle.old.p.y);
                context.lineTo(particle.p.x, particle.p.y);
                context.closePath();
                context.stroke();
            }
        };

        return renderer;
    }

    handleResize(width, height) {
        this.crossZoneBehaviour.reset(
            new Proton.RectZone(0, 0, width, height),
            "dead"
        );
        this.renderer.resize(width, height);
    }

    handleMouseDown(e) {
        this.clearCanvas();
        this.emitter.removeAllParticles();
        this.emitter.setOrigin(e.clientX, e.clientY);
    }

    renderProton() {
        this.proton.update();
    }

    render() {
        return (
            <Canvas
                //globalCompositeOperation="lighter"
                onMouseDown={this.handleMouseDown.bind(this)}
                onCanvasInited={this.handleCanvasInited.bind(this)}
                onResize={this.handleResize.bind(this)}
            />
        );
    }
}
