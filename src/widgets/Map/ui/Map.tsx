'use client';
import type mapboxgl from 'mapbox-gl';
import { type ReactNode, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { type MapRef, Marker, type ViewState } from 'react-map-gl';
import { MarkerPopup, testPopup } from '~/features/MarkerPopup/ui/MarkerPopup';
import MarkerIcon from '~/shared/assets/icons/marker.svg';
import { env } from '~/shared/lib';
import { api } from '~/trpc/react';

type SensorsType = Array<{
    location: any;
    id: string;
    name: string;
    model: string;
    version: number;
    firmwareVersion: string;
    serialNumber: string;
    latitude: number;
    longitude: number;
}>;

const initialViewState: ViewState = {
    longitude: 73.3682,
    latitude: 54.9881,
    zoom: 12,
    bearing: 0,
    pitch: 0,
    padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
};

const renderContent = (content: ReactNode) => {
    const div = document.createElement('div');
    const root = createRoot(div);
    flushSync(() => {
        root.render(content);
    });
    return div.innerHTML;
};

const getCoords = (bbox: mapboxgl.LngLatBounds | undefined) => {
    if (!bbox) {
        return [];
    }

    return [bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()];
};

export const MapComponent = () => {
    // const sensors = api.sensor.getAll.useQuery();

    // const sensorsId = useMemo(() => {
    //     return sensors.data?.map(sensor => {
    //         return sensor.id;
    //     });
    // }, []);

    // const sensorDataArray = sensorsId?.map(sensorId => {
    //     return api.sensorData.getBySensorId.useQuery(sensorId, { enabled: !!sensorId });
    // });
    const mapRef = useRef<MapRef>(null);

    const [viewState, setViewState] = useState<ViewState>(initialViewState);

    const [coords, setCoords] = useState<number[]>([73.28031, 54.90021, 73.45509, 55.076992]);

    const sensors = api.sensor.getByLocation.useQuery(coords, {
        enabled: !!coords,
        trpc: { abortOnUnmount: !!coords },
    });

    useEffect(() => {
        console.log(sensors.data);
    }, [sensors, coords]);

    const handleMapMove = useCallback(() => {
        const bbox = mapRef.current?.getBounds();
        setCoords(getCoords(bbox));
        console.log('Bbox при перемещении:', coords);
    }, []);

    const handleMapZoom = useCallback(() => {
        const bbox = mapRef.current?.getBounds();
        setCoords(getCoords(bbox));
        console.log('Bbox при изменении зума:', coords);
    }, []);

    // const popups = useMemo(() => {
    //     return sensors.data?.map((sensor, index) => {
    //         const content = renderContent(<MarkerPopup sensor={sensor} sensorDataArray={[]} />);

    //         return new mapboxgl.Popup().setHTML(content);
    //     });
    // }, [sensors]);

    // useEffect(() => {
    //     console.log(popups);
    // });

    return (
        <Map
            {...viewState}
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
            onZoom={handleMapZoom}
            onMove={evt => {
                setViewState(evt.viewState);
                handleMapMove();
            }}
            ref={mapRef}
            mapStyle={'mapbox://styles/mapbox/streets-v11'}
            style={{ width: '100%', height: '100vh', display: 'flex' }}
        >
            {sensors.data?.map((sensor, index) => {
                return (
                    <Marker
                        longitude={sensor.longitude}
                        latitude={sensor.latitude}
                        anchor='bottom'
                        style={{ display: 'flex', width: 50, height: 50 }}
                        //popup={popups[index]}
                    >
                        <MarkerIcon className={'fill-btn-green stroke-green-500'} />
                    </Marker>
                );
            })}
        </Map>
    );
};
