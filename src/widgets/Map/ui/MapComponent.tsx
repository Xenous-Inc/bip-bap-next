'use client';
import cn from 'classnames';
import type mapboxgl from 'mapbox-gl';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { type MapRef, Marker, type ViewState } from 'react-map-gl';
import { Loader } from '~/entities/Loader';
import MarkerIcon from '~/shared/assets/icons/marker.svg';
import IconMinus from '~/shared/assets/icons/minus.svg';
import IconPlus from '~/shared/assets/icons/plus.svg';
import { env } from '~/shared/lib';
import { api } from '~/trpc/react';

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

const getCoords = (bbox: mapboxgl.LngLatBounds | undefined) => {
    if (!bbox) {
        return [];
    }

    return [bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()];
};

export const MapComponent = () => {
    const mapRef = useRef<MapRef>(null);

    const [viewState, setViewState] = useState<ViewState>(initialViewState);

    const [coords, setCoords] = useState<number[]>([73.28031, 54.90021, 73.45509, 55.076992]);

    const [isLoading, setIsLoading] = useState(true);

    const sensors = api.sensor.getByLocation.useQuery(coords, {
        enabled: !!coords,
        trpc: { abortOnUnmount: !!coords },
    });

    const handleMapMove = useCallback(() => {
        const bbox = mapRef.current?.getBounds();
        setCoords(getCoords(bbox));
    }, []);

    const handleMapZoom = useCallback(() => {
        const bbox = mapRef.current?.getBounds();
        setCoords(getCoords(bbox));
    }, []);

    const handleZoomIn = () => {
        const newZoom = Math.min(viewState.zoom + 1, 20);
        setViewState({ ...viewState, zoom: newZoom });
        setCoords(getCoords(mapRef.current?.getBounds()));
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(viewState.zoom - 1, 0);
        setViewState({ ...viewState, zoom: newZoom });
        setCoords(getCoords(mapRef.current?.getBounds()));
    };

    useEffect(() => {
        setIsLoading(sensors.isLoading);
    }, [sensors.isLoading]);

    return (
        <div className={cn('flex h-screen w-full bg-white', isLoading ? 'opacity-50' : '')}>
            <Map
                {...viewState}
                mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
                onZoom={evt => {
                    setViewState(evt.viewState);
                    handleMapZoom();
                }}
                onMove={evt => {
                    setViewState(evt.viewState);
                    handleMapMove();
                }}
                ref={mapRef}
                mapStyle={'mapbox://styles/mapbox/streets-v11'}
                style={{ width: '100%', height: '100vh', display: 'flex' }}
            >
                {sensors.isLoading ? (
                    <Loader />
                ) : (
                    sensors.data?.map(sensor => {
                        return (
                            <Marker
                                longitude={sensor.longitude}
                                latitude={sensor.latitude}
                                anchor='bottom'
                                style={{ display: 'flex', width: 50, height: 50 }}
                            >
                                <MarkerIcon className={'fill-btn-green stroke-green-500'} />
                            </Marker>
                        );
                    })
                )}
                <div className='absolute right-0 top-1/2 mb-10 mr-2.5 flex -translate-y-1/2 transform flex-col gap-6'>
                    <button
                        onClick={handleZoomIn}
                        className='flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md'
                    >
                        <IconPlus style={{ width: '31px', height: '31px' }} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className='flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md'
                    >
                        <IconMinus style={{ width: '31px', height: '31px' }} />
                    </button>
                </div>
            </Map>
        </div>
    );
};
