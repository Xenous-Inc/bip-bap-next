'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { env } from '~/shared/lib';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {
    const [map, setMap] = useState<mapboxgl.Map>();

    const mapNode = useRef(null);

    useEffect(() => {
        const node = mapNode.current;

        if (typeof window === 'undefined' || node === null) return;

        const mapboxMap = new mapboxgl.Map({
            container: node,
            accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [73.3682, 54.9881],
            zoom: 12,
        });

        setMap(mapboxMap);

        return () => {
            mapboxMap.remove();
        };
    }, []);

    return <div ref={mapNode} className={'h-screen w-full'} />;
};
