import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Circle, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';


const Map = (props) => {
    const [anchors, setAnchors] = useState([]);
    const [tags, setTags] = useState([]);
    const [image] = useImage('evans-1st-rev2-3.png');
    const containerRef = useRef(null);
    const [stageSize, setStageSize] = useState({ width: 7100, height: 5525 });
    const nativeWidth = 7100;
    const nativeHeight = 5525;


    useEffect(() => {
        const handleResize = () => {
            const container = containerRef.current;
            if (container) {
                const scale = Math.min(
                    container.offsetWidth / nativeWidth,
                    container.offsetHeight / nativeHeight
                );
                setStageSize({
                    width: nativeWidth * scale,
                    height: nativeHeight * scale,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Initial load of anchors
        fetch('./api/anchors/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ***TOKEN GOES HERE***`
            }
        })
            .then(res => res.json())
            .then(data => setAnchors(data));


        // Poll for tags every second
        const interval = setInterval(() => {
            fetch('./api/tags/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ***TOKEN GOES HERE***`
                }
            })
                .then(res => res.json())
                .then(data => setTags(data));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const scaleX = stageSize.width / nativeWidth;
    const scaleY = stageSize.height / nativeHeight;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100vh' }}>
            <Stage width={stageSize.width} height={stageSize.height} scaleX={scaleX} scaleY={scaleY}>
                <Layer>
                    {image && <KonvaImage image={image} width={nativeWidth} height={nativeHeight} />}

                    {anchors.map((a, i) => (
                        <React.Fragment key={`anchor-${i}`}>
                            <Circle x={a.pos_x} y={nativeHeight - a.pos_y} radius={25} fill="blue" />
                            {/* <Text text={`Anchor ${a.name}`} x={a.pos_x + 8} y={nativeHeight - a.pos_y - 8} fontSize={12} fill="blue" /> */}
                        </React.Fragment>
                    ))}

                    {tags.map((t, i) => (
                        <React.Fragment key={`tag-${i}`}>
                            <Circle x={t.pos_x} y={nativeHeight - t.pos_y} radius={35} fill="red" />
                            <Text text={t.name} x={t.pos_x + 40} y={nativeHeight - t.pos_y + 20} fontSize={72} fill="red" fontVariant='bold' />
                        </React.Fragment>
                    ))}

                    <React.Fragment key={`destination}`}>
                        <Circle x={2400} y={nativeHeight - 1650} radius={35} fill="green" />
                        <Text text={"Destination"} x={2400 + 40} y={nativeHeight - 1650 + 20} fontSize={72} fill="green" fontVariant='bold' />
                    </React.Fragment>
                </Layer>
            </Stage>
        </div>
    );
};
export default Map;