'use client';
import cn from 'classnames';
import { type BBox } from 'geojson';
import type mapboxgl from 'mapbox-gl';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { type MapRef, Marker, type ViewState } from 'react-map-gl';
import { type ClusterProperties, type PointFeature } from 'supercluster';
import useSupercluster from 'use-supercluster';
import { Loader } from '~/entities/Loader';
import MarkerIcon from '~/shared/assets/icons/marker.svg';
import { env } from '~/shared/lib';
import { api } from '~/trpc/react';
import { type RouterOutputs } from '~/trpc/shared';

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

type SensorOutputType = RouterOutputs['sensor']['getByLocation'];

type SensorProps = { sensorId: string } & Omit<SensorOutputType[number], 'latitude' | 'longitude' | 'id'>;

export const MapComponent = () => {
    const mapRef = useRef<MapRef>(null);

    const [viewState, setViewState] = useState<ViewState>(initialViewState);

    const [coords, setCoords] = useState<number[]>([73.28031, 54.90021, 73.45509, 55.076992]);

    const [isLoading, setIsLoading] = useState(true);

    const sensors = api.sensor.getByLocation.useQuery(coords, {
        enabled: !!coords,
        trpc: { abortOnUnmount: !!coords },
    });

    const sensorLoaded = sensors.data && !sensors.error ? sensors.data : [];

    const handleMapMove = useCallback(() => {
        const bbox = mapRef.current?.getBounds();
        setCoords(getCoords(bbox));
    }, []);

    const handleMapZoom = useCallback(() => {
        const bbox = mapRef.current?.getBounds();
        setCoords(getCoords(bbox));
    }, []);

    const bounds = mapRef.current ? (mapRef.current.getMap().getBounds().toArray().flat() as BBox) : undefined;

    const points = sensorLoaded.map(sensor => ({
        type: 'Feature',
        properties: {
            sensorId: sensor.id,
            location: sensor.location,
            name: sensor.name,
            model: sensor.model,
            version: sensor.version,
            firmwareVersion: sensor.firmwareVersion,
            serialNumber: sensor.serialNumber,
        },
        geometry: {
            type: 'Point',
            coordinates: [sensor.longitude, sensor.latitude],
        },
    })) as unknown as Array<PointFeature<ClusterProperties & SensorProps>>;

    const { clusters } = useSupercluster({
        bounds: bounds,
        points,
        zoom: viewState.zoom,
        options: { radius: 60, maxZoom: 12 },
    });

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
                    clusters.map(cluster => {
                        const [longitude, latitude] = cluster.geometry.coordinates;

                        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                        if (isCluster) {
                            return (
                                <Marker
                                    key={`cluster-${cluster.properties.cluster_id}`}
                                    latitude={latitude ?? 0}
                                    longitude={longitude ?? 0}
                                >
                                    <div
                                        className='flex items-center justify-center bg-green-500 text-white'
                                        style={{
                                            width: `${10 + (pointCount / points.length) * 50}px`,
                                            height: `${10 + (pointCount / points.length) * 50}px`,
                                            borderRadius: '100%',
                                        }}
                                    >
                                        {pointCount}
                                    </div>
                                </Marker>
                            );
                        }

                        return (
                            <Marker
                                key={`point-${cluster.properties.cluster_id}`}
                                latitude={latitude ?? -1}
                                longitude={longitude ?? -1}
                                anchor='bottom'
                                style={{ display: 'flex', width: 50, height: 50 }}
                            >
                                <MarkerIcon className={'fill-btn-green stroke-green-500'} />
                            </Marker>
                        );
                    })
                )}
            </Map>
        </div>
    );
};
