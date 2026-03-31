"use client";

import { useState } from "react";

function createStars(count) {
    return Array.from({ length: count }, (_, index) => ({
        id: index,
        size: Math.random() * 2 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
    }));
}

export default function StarField({ count = 60 }) {
    const [stars] = useState(() => createStars(count));

    return (
        <div className="pointer-events-none absolute inset-0">
            {stars.map((star) => (
                <span
                    key={star.id}
                    className="star"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        animationDelay: `${star.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}
