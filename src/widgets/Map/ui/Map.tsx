'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { env } from '~/shared/lib';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerPopup } from '~/features/MarkerPopup/ui/MarkerPopup';
import { api } from '~/trpc/react';
import ReactDOMServer from 'react-dom/server';

export const Map = () => {
    const sensors = api.sensor.getAll.useQuery();
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
    useEffect(() => {
        if (map)
            map.on('load', () => {
                console.log('JOPA');
                if (sensors.data)
                    for (const sensor of sensors.data) {
                        const renderMarkerPopup = ReactDOMServer.renderToString(
                            sensors.data ? <MarkerPopup sensor={sensor} /> : <div>Error</div>
                        );
                        const popup = new mapboxgl.Popup({ offset: [0, -15] }).setHTML(renderMarkerPopup).addTo(map);

                        const marker = document.createElement('div');

                        marker.style.width = '50px';
                        marker.style.height = '50px';
                        marker.style.backgroundColor = 'green';
                        console.log(marker);
                        if (sensor.latitude && sensor.longitude) {
                            new mapboxgl.Marker(marker)
                                .setLngLat({ lat: sensor.latitude, lng: sensor.longitude })
                                .setPopup(popup)
                                .addTo(map);
                        }
                    }
            });
    }, [map]);

    return <div ref={mapNode} className={'h-screen w-full'} />;
};
