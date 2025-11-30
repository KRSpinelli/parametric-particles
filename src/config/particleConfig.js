export const defaultParticleSettings = {
    formula: '50',
    size: 1,
    drawSpeed: 0.01,
    xDrift: 1,
    yDrift: 1,
    driftDelay: 0.1,
    lifespan: 5,
    damping: 0.0001,
    particleVelocity: 0.5,
    hueMin: 0,
    hueMax: 360,
    velocity: {
        min: 0.5,
        max: 1,
        angle: 90
    },
    scale: {
        start: 1,
        end: 0.1
    },
    emissionRate: {
        particles: [13, 15],
        time: [0.01, 0.03]
    }
};

export const presets = {
    gentle: {
        ...defaultParticleSettings,
        xDrift: 2,
        yDrift: 2,
        velocity: { min: 0.3, max: 0.6, angle: 90 }
    },

    chaotic: {
        ...defaultParticleSettings,
        xDrift: 20,
        yDrift: 20,
        velocity: { min: 2, max: 4, angle: 90 }
    },

    rainbow: {
        ...defaultParticleSettings,
        hueMin: 0,
        hueMax: 360
    },

    blueGreen: {
        ...defaultParticleSettings,
        hueMin: 120,
        hueMax: 240
    }
};