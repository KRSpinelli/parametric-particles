import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import Proton from "proton-engine";
import RAFManager from "raf-manager";
import Canvas from "./Canvas";
import CustomEmitter from "./CustomEmitter";

const Particles = forwardRef(({ size, drawSpeed, formula, xDrift, yDrift, driftDelay, lifespan, damping, hueMin, hueMax, particleVelocity, emitterRateNumParticles, emitterRateTime }, ref) => {
    const canvasRef = useRef(null);
    const protonRef = useRef(null);
    const emitterRef = useRef(null);
    const rendererRef = useRef(null);
    const crossZoneBehaviourRef = useRef(null);
    const radiusInitializerRef = useRef(null);
    const lifespanInitializerRef = useRef(null);
    const velocityInitializerRef = useRef(null);
    const driftBehaviourRef = useRef(null);
    const hueRef = useRef(0);
    const drawEnabledRef = useRef(false);
    const hueMinRef = useRef(hueMin);
    const hueMaxRef = useRef(hueMax);
    const hueRangeRef = useRef(hueMax - hueMin);

    useEffect(() => {
        hueMinRef.current = hueMin;
        hueMaxRef.current = hueMax;
    }, [hueMin, hueMax]);

    const drawCircle = true;
    const colorTemplate = `hsla(hue,80%,50%, 0.9)`;

    useImperativeHandle(ref, () => ({
        clearCanvas: clearCanvas
    }));

    const clearCanvas = (e) => {
        if (canvasRef.current && emitterRef.current) {
            setTimeout(() => {
                drawEnabledRef.current = false;
                const context = canvasRef.current.getContext("2d");
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                emitterRef.current.removeAllParticles();
                drawEnabledRef.current = true;
            }, 50);
        }
    }

    // Render loop - useCallback to maintain stable ref and prevent react re-renders
    const renderProton = useCallback(() => {
        if (protonRef.current) {
            protonRef.current.update();
        }
    }, []);

    const createRenderer = useCallback((canvas) => {
        const context = canvas.getContext("2d");
        const renderer = new Proton.CanvasRenderer(canvas);

        renderer.onProtonUpdate = () => {
            const increment = hueRangeRef.current / 360;
            hueRef.current += increment;
            context.fillStyle = "rgba(0, 0, 0, 0.015)";
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        renderer.onParticleCreated = particle => {
            hueRangeRef.current = hueMaxRef.current - hueMinRef.current;
            if (hueRangeRef.current < 0) hueRangeRef.current += 360; // Handle wrapping

            let hue = hueMinRef.current + (hueRef.current % hueRangeRef.current);
            if (hueRef.current > hueRangeRef.current) hueRef.current -= hueRangeRef.current;
            if (hue >= 360) hue -= 360;

            particle.color = colorTemplate.replace("hue", Math.round(hue));
        };

        renderer.onParticleUpdate = particle => {
            if (!drawEnabledRef.current) return;
            if (drawCircle) {
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
    }, [colorTemplate, drawCircle]);

    const createProton = useCallback((canvas) => {
        const proton = new Proton();
        const emitter = new CustomEmitter({ width: canvas.width, height: canvas.height });

        emitter.damping = damping;

        emitter.rate = new Proton.Rate(
            Proton.getSpan(emitterRateNumParticles, emitterRateNumParticles + 2),
            Proton.getSpan(emitterRateTime, emitterRateTime + 0.02)
        );

        emitter.setDrawSpeed(drawSpeed);
        emitter.addInitialize(new Proton.Mass(1));

        const radiusInitializer = new Proton.Radius(size, size * 1.5);
        emitter.addInitialize(radiusInitializer);
        radiusInitializerRef.current = radiusInitializer;

        const lifespanInitializer = new Proton.Life(lifespan, lifespan + 0.5);
        emitter.addInitialize(lifespanInitializer);
        lifespanInitializerRef.current = lifespanInitializer;

        const velocityInitializer = new Proton.Velocity(Proton.getSpan(particleVelocity, particleVelocity + 0.5), 90, "polar");
        emitter.addInitialize(velocityInitializer);
        velocityInitializerRef.current = velocityInitializer;

        const crossZoneBehaviour = new Proton.CrossZone(
            new Proton.RectZone(0, 0, canvas.width, canvas.height),
            "dead"
        );
        emitter.addBehaviour(crossZoneBehaviour);

        const driftBehaviour = new Proton.RandomDrift(xDrift, yDrift, driftDelay);
        emitter.addBehaviour(driftBehaviour);
        driftBehaviourRef.current = driftBehaviour;

        emitter.addBehaviour(new Proton.Scale(1, 0.1));

        emitter.width = canvas.width;
        emitter.height = canvas.height;
        proton.addEmitter(emitter);
        emitter.emit();

        const renderer = createRenderer(canvas);
        proton.addRenderer(renderer);

        protonRef.current = proton;
        rendererRef.current = renderer;
        emitterRef.current = emitter;
        crossZoneBehaviourRef.current = crossZoneBehaviour;
    }, [size, drawSpeed, xDrift, yDrift, driftDelay, lifespan, damping, createRenderer]);

    const handleCanvasInited = useCallback((canvas) => {
        canvasRef.current = canvas;
        setTimeout(() => {
            drawEnabledRef.current = true;
        }, 200);
        createProton(canvas);
        RAFManager.add(renderProton);
    }, [createProton, renderProton]);

    const handleResize = useCallback((width, height) => {
        if (crossZoneBehaviourRef.current && rendererRef.current) {
            crossZoneBehaviourRef.current.reset(
                new Proton.RectZone(0, 0, width, height),
                "dead"
            );
            rendererRef.current.resize(width, height);
        }
    }, []);

    const handleMouseDown = useCallback((e) => {
        if (emitterRef.current) {
            emitterRef.current.setOrigin(e.clientX, e.clientY);
        }
        clearCanvas(e);
    }, []);

    useEffect(() => {
        if (emitterRef.current) {
            emitterRef.current.setDrawSpeed(drawSpeed);
        }
    }, [drawSpeed]);

    useEffect(() => {
        if (emitterRef.current && formula) {
            emitterRef.current.setFormula(formula);
        }
    }, [formula]);

    useEffect(() => {
        if (emitterRef.current && radiusInitializerRef.current) {
            emitterRef.current.removeInitialize(radiusInitializerRef.current);
            const newRadiusInitializer = new Proton.Radius(size, size * 1.5);
            emitterRef.current.addInitialize(newRadiusInitializer);
            radiusInitializerRef.current = newRadiusInitializer;
        }
    }, [size]);

    useEffect(() => {
        if (emitterRef.current && damping) {
            emitterRef.current.damping = damping;
        }
    }, [damping]);

    useEffect(() => {
        if (emitterRef.current && lifespanInitializerRef.current) {
            emitterRef.current.removeInitialize(lifespanInitializerRef.current);
            const newLifespanInitializer = new Proton.Life(lifespan, lifespan + 0.5);
            emitterRef.current.addInitialize(newLifespanInitializer);
            lifespanInitializerRef.current = newLifespanInitializer;
        }
    }, [lifespan]);

    useEffect(() => {
        if (emitterRef.current) {
            emitterRef.current.rate = new Proton.Rate(
                Proton.getSpan(emitterRateNumParticles, emitterRateNumParticles + 2),
                Proton.getSpan(emitterRateTime, emitterRateTime + 0.02)
            );
        }
    }, [emitterRateNumParticles, emitterRateTime]);

    useEffect(() => {
        if (emitterRef.current && velocityInitializerRef.current) {
            emitterRef.current.removeInitialize(velocityInitializerRef.current);
            const newVelocityInitializer = new Proton.Velocity(Proton.getSpan(particleVelocity, particleVelocity + 0.5), 90, "polar");
            emitterRef.current.addInitialize(newVelocityInitializer);
            velocityInitializerRef.current = newVelocityInitializer;
        }
    }, [particleVelocity]);

    useEffect(() => {
        if (emitterRef.current) {
            emitterRef.current.removeBehaviour(driftBehaviourRef.current);
            const newDriftBehaviour = new Proton.RandomDrift(xDrift, yDrift, driftDelay);
            emitterRef.current.addBehaviour(newDriftBehaviour);
            driftBehaviourRef.current = newDriftBehaviour;
        }
    }, [xDrift, yDrift, driftDelay]);

    useEffect(() => {
        return () => {
            try {
                RAFManager.remove(renderProton);
                if (protonRef.current) {
                    protonRef.current.destroy();
                }
            } catch (e) {
                console.error('Cleanup error:', e);
            }
        };
    }, [renderProton]);

    return (
        <Canvas
            onMouseDown={handleMouseDown}
            onCanvasInited={handleCanvasInited}
            onResize={handleResize}
        />
    );
});

Particles.displayName = 'Particles';

export default Particles;
