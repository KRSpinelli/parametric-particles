import React, { useRef, useEffect, useState } from 'react';

const ColorWheel = ({ hueMin, hueMax, onHueChange }) => {
    const canvasRef = useRef(null);
    const [dragging, setDragging] = useState(null); // 'min' or 'max'
    const size = 150;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;

    const angleToHue = (angle) => {
        let hue = ((angle * 180 / Math.PI) + 90) % 360;
        if (hue < 0) hue += 360;
        return Math.round(hue);
    };

    const hueToAngle = (hue) => {
        return ((hue - 90) * Math.PI / 180);
    };

    const hueToPosition = (hue) => {
        const angle = hueToAngle(hue);
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    };

    const drawColorWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);

        for (let i = 0; i < 360; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius,
                hueToAngle(i), hueToAngle(i + 1));
            ctx.strokeStyle = `hsl(${i}, 80%, 50%)`;
            ctx.lineWidth = 15;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        let startAngle = hueToAngle(hueMin);
        let endAngle = hueToAngle(hueMax);

        if (hueMax < hueMin) {
            endAngle += 2 * Math.PI;
        }

        ctx.arc(centerX, centerY, radius - 7.5, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const minPos = hueToPosition(hueMin);
        ctx.beginPath();
        ctx.arc(minPos.x, minPos.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${hueMin}, 80%, 50%)`;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        const maxPos = hueToPosition(hueMax);
        ctx.beginPath();
        ctx.arc(maxPos.x, maxPos.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${hueMax}, 80%, 50%)`;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${hueMin}° - ${hueMax}°`, centerX, centerY);
    };

    useEffect(() => {
        drawColorWheel();
    }, [hueMin, hueMax]);

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const minPos = hueToPosition(hueMin);
        const maxPos = hueToPosition(hueMax);

        const distToMin = Math.sqrt((x - minPos.x) ** 2 + (y - minPos.y) ** 2);
        const distToMax = Math.sqrt((x - maxPos.x) ** 2 + (y - maxPos.y) ** 2);

        if (distToMin < 15) {
            setDragging('min');
        } else if (distToMax < 15) {
            setDragging('max');
        }
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - centerX;
        const dy = y - centerY;
        const angle = Math.atan2(dy, dx);
        const newHue = angleToHue(angle);

        if (dragging === 'min') {
            onHueChange(newHue, hueMax);
        } else if (dragging === 'max') {
            onHueChange(hueMin, newHue);
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging, hueMin, hueMax]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                onMouseDown={handleMouseDown}
                style={{ cursor: dragging ? 'grabbing' : 'grab' }}
            />
        </div>
    );
};

export default ColorWheel;

